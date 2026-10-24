import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, ShieldCheck, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ApiError } from '../../../api/apiClient';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Textarea } from '../../../components/ui/Form';
import { useAuth } from '../../auth/context/AuthContext';
import { joinApi, practiceOptions } from '../api/joinApi';
import { CityPicker, type PickedCity } from '../components/CityPicker';
import { FormSection, JoinLayout } from '../components/JoinLayout';

/** Mirrors the backend rule: first name + last initial. */
function previewName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Your name';
  const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  return parts.length > 1 ? `${first} ${parts[parts.length - 1].charAt(0).toUpperCase()}.` : first;
}

export function MeditatorProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const existing = useQuery({
    queryKey: ['my-meditator'],
    queryFn: async () => {
      try {
        return await joinApi.myMeditator();
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    enabled: Boolean(user),
  });

  const [name, setName] = useState('');
  const [city, setCity] = useState<PickedCity | null>(null);
  const [practices, setPractices] = useState<string[]>([]);
  const [languages, setLanguages] = useState('');
  const [about, setAbout] = useState('');
  const [openToConnect, setOpenToConnect] = useState(true);
  const [openToVolunteer, setOpenToVolunteer] = useState(false);
  const [visible, setVisible] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  // Fill the form once, from the saved profile or the account name.
  useEffect(() => {
    if (existing.isLoading || !user) return;
    const profile = existing.data;
    if (profile) {
      setCity({ id: profile.cityId, name: profile.cityName, lat: profile.lat, lng: profile.lng });
      setPractices(profile.practices);
      setLanguages(profile.languages ?? '');
      setAbout(profile.about ?? '');
      setOpenToConnect(profile.openToConnect);
      setOpenToVolunteer(profile.openToVolunteer);
      setVisible(profile.visible);
    }
    setName((current) => current || user.name || '');
  }, [existing.isLoading, existing.data, user]);

  function togglePractice(practice: string) {
    setPractices((current) => (current.includes(practice) ? current.filter((p) => p !== practice) : [...current, practice]));
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!city) {
      setMessage({ kind: 'error', text: 'Please choose your city.' });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      await joinApi.saveMeditator({ name, cityId: city.id, practices, languages, about, openToConnect, openToVolunteer, visible });
      await queryClient.invalidateQueries({ queryKey: ['my-meditator'] });
      await queryClient.invalidateQueries({ queryKey: ['globe-markers'] });
      setMessage({ kind: 'ok', text: visible ? 'Saved. You are now on the map.' : 'Saved. Your profile is hidden from others.' });
    } catch (error) {
      setMessage({ kind: 'error', text: error instanceof Error ? error.message : 'Could not save.' });
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm('Remove your meditator profile completely? Your account stays.')) return;
    setBusy(true);
    try {
      await joinApi.deleteMeditator();
      await queryClient.invalidateQueries({ queryKey: ['my-meditator'] });
      await queryClient.invalidateQueries({ queryKey: ['globe-markers'] });
      setCity(null);
      setPractices([]);
      setAbout('');
      setMessage({ kind: 'ok', text: 'Your meditator profile has been removed.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <JoinLayout
      title={existing.data ? 'Your meditator profile' : 'Add yourself as a meditator'}
      subtitle="a dot of light on the map"
      intro="Let fellow meditators know there is someone practising near them. Only a rough location and your first name are ever shown."
    >
      <form onSubmit={save} className="grid gap-6">
        <FormSection title="About you">
          <FormField label="Your name">
            <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} placeholder="e.g. Priya Narayanan" />
          </FormField>
          <FormField label="City">
            <CityPicker value={city} onChange={setCity} />
          </FormField>
          <FormField label="Languages you speak (optional)">
            <Input value={languages} onChange={(e) => setLanguages(e.target.value)} maxLength={255} placeholder="e.g. Tamil, English" />
          </FormField>
          <FormField label="A line about you (optional)">
            <Textarea value={about} onChange={(e) => setAbout(e.target.value)} maxLength={500} placeholder="What brought you to the practices, what you'd love to share…" />
          </FormField>
        </FormSection>

        <FormSection title="Your practices" hint="Choose any you practise regularly.">
          <div className="flex flex-wrap gap-2">
            {practiceOptions.map((practice) => {
              const on = practices.includes(practice);
              return (
                <button
                  key={practice}
                  type="button"
                  aria-pressed={on}
                  onClick={() => togglePractice(practice)}
                  className={`rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition ${
                    on ? 'border-leaf bg-leaf text-cream' : 'border-border bg-white text-muted hover:border-leaf/50 hover:text-ink'
                  }`}
                >
                  {practice}
                </button>
              );
            })}
          </div>
        </FormSection>

        <FormSection title="Connecting">
          <label className="flex items-start gap-3 text-[15px]">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-[#cf4520]" checked={openToConnect} onChange={(e) => setOpenToConnect(e.target.checked)} />
            <span>
              <span className="font-semibold">Open to connect</span>
              <span className="block text-sm text-muted">Happy to meet or practise with others nearby.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 text-[15px]">
            <input type="checkbox" className="mt-1 h-4 w-4 accent-[#cf4520]" checked={openToVolunteer} onChange={(e) => setOpenToVolunteer(e.target.checked)} />
            <span>
              <span className="font-semibold">Open to volunteer</span>
              <span className="block text-sm text-muted">Local initiatives may reach out when they need a hand.</span>
            </span>
          </label>
        </FormSection>

        <div className="rounded-xl border border-leaf/25 bg-leaf/5 p-5 sm:p-6">
          <p className="inline-flex items-center gap-2 font-display text-xl text-leaf">
            <ShieldCheck size={20} /> Your privacy
          </p>
          <ul className="mt-3 space-y-1.5 text-[15px] text-ink/80">
            <li>• You'll appear as <strong>{previewName(name)}</strong>, never your full name.</li>
            <li>• Your dot is placed at a random spot a few kilometres from the centre of {city?.name ?? 'your city'}, never your home.</li>
            <li>• Your email and phone are never shown.</li>
            <li>• You can hide yourself or delete your profile at any time.</li>
          </ul>
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            className={`mt-4 inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition ${
              visible ? 'border-leaf bg-leaf text-cream' : 'border-border bg-white text-ink'
            }`}
          >
            {visible ? <Eye size={16} /> : <EyeOff size={16} />}
            {visible ? 'Visible on the map' : 'Hidden from others'}
          </button>
        </div>

        {message && (
          <p role="status" className={`rounded-md px-4 py-3 text-sm ${message.kind === 'ok' ? 'bg-leaf/10 text-leaf' : 'bg-saffron-light text-ember'}`}>
            {message.text}{' '}
            {message.kind === 'ok' && city && visible && (
              <Link className="font-semibold underline" to="/#globe">
                See the globe
              </Link>
            )}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="submit" disabled={busy || !name.trim()}>
            {busy ? 'Saving…' : existing.data ? 'Save changes' : 'Add me to the map'}
          </Button>
          {existing.data && (
            <button type="button" onClick={remove} disabled={busy} className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ember">
              <Trash2 size={16} /> Remove my profile
            </button>
          )}
        </div>
      </form>
    </JoinLayout>
  );
}
