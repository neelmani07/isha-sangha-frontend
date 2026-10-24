import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { resourcesApi } from '../../../api/resources';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Textarea } from '../../../components/ui/Form';
import type { TeachingMode } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { joinApi, type MyListing } from '../api/joinApi';
import { CityPicker, type PickedCity } from '../components/CityPicker';
import { FormSection, JoinLayout } from '../components/JoinLayout';
import { LocationPicker } from '../components/LocationPicker';
import { ProofUpload } from '../components/ProofUpload';
import { RejectionNotice, SubmittedNotice } from '../components/SubmissionNotices';

const modes: { value: TeachingMode; label: string }[] = [
  { value: 'IN_PERSON', label: 'In person' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'BOTH', label: 'Both' },
];

export function TeacherSubmissionPage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const { user } = useAuth();

  const programs = useQuery({ queryKey: ['programs'], queryFn: () => resourcesApi.programs() });
  const existing = useQuery({
    queryKey: ['own-teacher', editingId],
    queryFn: () => joinApi.ownTeacher(editingId!),
    enabled: Boolean(user && editingId),
  });

  const [name, setName] = useState('');
  const [city, setCity] = useState<PickedCity | null>(null);
  const [bio, setBio] = useState('');
  const [programIds, setProgramIds] = useState<number[]>([]);
  const [mode, setMode] = useState<TeachingMode>('IN_PERSON');
  const [languages, setLanguages] = useState('');
  const [years, setYears] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [proofKey, setProofKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<MyListing | null>(null);

  useEffect(() => {
    const t = existing.data?.teacher;
    if (!t) return;
    setName(t.name);
    setCity({ id: t.cityId, name: t.cityName, lat: t.latitude, lng: t.longitude });
    setBio(t.bio ?? '');
    setProgramIds(t.programs.map((p) => p.id));
    setMode(t.teachingMode);
    setLanguages(t.languages ?? '');
    setYears(t.yearsTeaching != null ? String(t.yearsTeaching) : '');
    setPhone(t.phone ?? '');
    setEmail(t.email ?? '');
    setWebsite(t.website ?? '');
    if (t.latitude != null && t.longitude != null) setPin({ lat: t.latitude, lng: t.longitude });
    setProofKey(existing.data?.proofKey ?? null);
  }, [existing.data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!city) return setError('Please choose the city where you teach.');
    if (!proofKey) return setError('Please attach your certificate or other proof.');
    setBusy(true);
    setError(null);
    const body = {
      name,
      cityId: city.id,
      bio,
      programIds,
      teachingMode: mode,
      languages,
      yearsTeaching: years ? Number(years) : undefined,
      phone,
      email,
      website,
      latitude: pin?.lat,
      longitude: pin?.lng,
      proofKey,
    };
    try {
      setSubmitted(editingId ? await joinApi.updateTeacher(editingId, body) : await joinApi.submitTeacher(body));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <JoinLayout title="Thank you" subtitle="your listing is with our reviewers">
        <SubmittedNotice listing={submitted} />
      </JoinLayout>
    );
  }

  return (
    <JoinLayout
      title={editingId ? 'Update your teacher listing' : 'List yourself as a teacher'}
      subtitle="so seekers can find your classes"
      intro="Your listing appears on the map after a volunteer checks your proof. Approved teachers get a verified badge."
    >
      {existing.data?.status === 'REJECTED' && <RejectionNotice reason={existing.data.rejectionReason} />}
      {existing.data?.status === 'APPROVED' ? (
        <p className="rounded-md bg-leaf/10 px-4 py-3 text-sm text-leaf">
          This listing is approved and live. To change it, please write to us through{' '}
          <Link to="/feedback" className="font-semibold underline">Feedback</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="grid gap-6">
          <FormSection title="You">
            <FormField label="Full name as on your certificate">
              <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={250} />
            </FormField>
            <FormField label="City where you teach">
              <CityPicker value={city} onChange={(c) => { setCity(c); setPin(null); }} />
            </FormField>
            <FormField label="About your classes (optional)">
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={2000} placeholder="Where and when you teach, who your classes suit…" />
            </FormField>
          </FormSection>

          <FormSection title="What you teach">
            <div className="flex flex-wrap gap-2">
              {(programs.data?.content ?? []).map((program) => {
                const on = programIds.includes(program.id);
                return (
                  <button
                    key={program.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setProgramIds((cur) => (on ? cur.filter((p) => p !== program.id) : [...cur, program.id]))}
                    className={`rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition ${
                      on ? 'border-teal bg-teal text-cream' : 'border-border bg-white text-muted hover:border-teal/50 hover:text-ink'
                    }`}
                  >
                    {program.name}
                  </button>
                );
              })}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField label="How you teach">
                <div className="flex rounded-md border border-border bg-white p-1">
                  {modes.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      aria-pressed={mode === m.value}
                      onClick={() => setMode(m.value)}
                      className={`flex-1 rounded px-2 py-2 text-sm font-semibold ${mode === m.value ? 'bg-teal text-cream' : 'text-muted'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </FormField>
              <FormField label="Languages">
                <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Tamil, English" />
              </FormField>
              <FormField label="Years teaching">
                <Input value={years} onChange={(e) => setYears(e.target.value.replace(/\D/g, '').slice(0, 2))} inputMode="numeric" placeholder="e.g. 4" />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="How people reach you" hint="Shown publicly once approved. Leave out anything you'd rather not share.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Phone / WhatsApp">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={50} placeholder="+91 …" />
              </FormField>
              <FormField label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
              </FormField>
            </div>
            <FormField label="Website or social page">
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={255} placeholder="https://…" />
            </FormField>
            {city?.lat != null && city.lng != null && (
              <FormField label="Where you teach (optional): click the map to pin your studio or usual venue">
                <LocationPicker center={{ lat: city.lat, lng: city.lng }} value={pin} onChange={setPin} kind="TEACHER" />
              </FormField>
            )}
          </FormSection>

          <FormSection title="Proof that you're a certified teacher" hint="For example your Isha teacher certificate or ID card. Required.">
            <ProofUpload value={proofKey} onChange={setProofKey} />
          </FormSection>

          {error && <p role="alert" className="rounded-md bg-saffron-light px-4 py-3 text-sm text-ember">{error}</p>}
          <Button type="submit" disabled={busy || !name.trim()} className="justify-self-start">
            {busy ? 'Submitting…' : editingId ? 'Resubmit for review' : 'Submit for review'}
          </Button>
        </form>
      )}
    </JoinLayout>
  );
}
