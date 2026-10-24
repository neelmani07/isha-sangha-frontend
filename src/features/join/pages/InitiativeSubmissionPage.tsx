import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../../components/ui/Form';
import type { InitiativeKind, InitiativeNeed } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { kindLabel, needLabel } from '../../initiatives/labels';
import { joinApi, type MyListing } from '../api/joinApi';
import { CityPicker, type PickedCity } from '../components/CityPicker';
import { ImageUpload } from '../components/ImageUpload';
import { FormSection, JoinLayout } from '../components/JoinLayout';
import { RejectionNotice, SubmittedNotice } from '../components/SubmissionNotices';

const kinds = Object.keys(kindLabel) as InitiativeKind[];
const needs = Object.keys(needLabel) as InitiativeNeed[];

export function InitiativeSubmissionPage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const { user } = useAuth();
  const existing = useQuery({
    queryKey: ['own-initiative', editingId],
    queryFn: () => joinApi.ownInitiative(editingId!),
    enabled: Boolean(user && editingId),
  });

  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<InitiativeKind>('SEVA');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState<PickedCity | null>(null);
  const [startedYear, setStartedYear] = useState('');
  const [startedByName, setStartedByName] = useState('');
  const [selectedNeeds, setSelectedNeeds] = useState<InitiativeNeed[]>([]);
  const [needsNote, setNeedsNote] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [photo, setPhoto] = useState<{ key: string | null; url: string | null }>({ key: null, url: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<MyListing | null>(null);

  useEffect(() => {
    const i = existing.data?.initiative;
    if (!i) return;
    setTitle(i.title);
    setKind(i.kind);
    setSummary(i.summary);
    setDescription(i.description ?? '');
    setCity({ id: i.cityId, name: i.cityName, lat: i.lat, lng: i.lng });
    setStartedYear(i.startedYear ? String(i.startedYear) : '');
    setStartedByName(i.startedByName ?? '');
    setSelectedNeeds(i.needs);
    setNeedsNote(i.needsNote ?? '');
    setWhatsapp(i.contactWhatsapp ?? '');
    setEmail(i.contactEmail ?? '');
    setWebsite(i.contactWebsite ?? '');
    setPhoto({ key: existing.data?.proofKey ?? null, url: i.photoUrl });
  }, [existing.data]);

  useEffect(() => {
    if (!editingId && user?.name) setStartedByName((current) => current || user.name || '');
  }, [editingId, user]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!city) return setError('Please choose the city where it happens.');
    if (!whatsapp.trim() && !email.trim() && !website.trim()) return setError('Please add at least one way for supporters to reach you.');
    setBusy(true);
    setError(null);
    const body = {
      title,
      kind,
      summary,
      description,
      cityId: city.id,
      startedYear: startedYear ? Number(startedYear) : undefined,
      startedByName,
      needs: selectedNeeds,
      needsNote,
      contactWhatsapp: whatsapp,
      contactEmail: email || undefined,
      contactWebsite: website,
      photoKey: photo.key ?? undefined,
    };
    try {
      setSubmitted(editingId ? await joinApi.updateInitiative(editingId, body) : await joinApi.submitInitiative(body));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <JoinLayout title="Thank you" subtitle="your initiative is with our reviewers">
        <SubmittedNotice listing={submitted} />
      </JoinLayout>
    );
  }

  return (
    <JoinLayout
      title={editingId ? 'Update your listing' : 'List your campaign or venture'}
      subtitle="and gather support from the sangha"
      intro="Seva, a class, a venture: tell people what you're building and what would help. A volunteer reviews every listing before it appears."
    >
      {existing.data?.status === 'REJECTED' && <RejectionNotice reason={existing.data.rejectionReason} />}
      {existing.data?.status === 'APPROVED' ? (
        <p className="rounded-md bg-leaf/10 px-4 py-3 text-sm text-leaf">
          This initiative is approved and live. To change it, please write to us through{' '}
          <Link to="/feedback" className="font-semibold underline">Feedback</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="grid gap-6">
          <FormSection title="Your initiative">
            <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <FormField label="Name">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="e.g. Saplings for School Grounds" />
              </FormField>
              <FormField label="Kind">
                <Select value={kind} onChange={(e) => setKind(e.target.value as InitiativeKind)}>
                  {kinds.map((k) => (
                    <option key={k} value={k}>{kindLabel[k]}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="In one line, what is it?">
              <Input value={summary} onChange={(e) => setSummary(e.target.value)} required maxLength={300} placeholder="Free yoga every Sunday morning in Cubbon Park" />
            </FormField>
            <FormField label="The story (optional)">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} placeholder="How it started, who it helps, what has happened so far…" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <FormField label="City">
                <CityPicker value={city} onChange={setCity} />
              </FormField>
              <FormField label="Started in (year)">
                <Input value={startedYear} onChange={(e) => setStartedYear(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" placeholder="2024" />
              </FormField>
            </div>
            <FormField label="Started by (shown publicly)">
              <Input value={startedByName} onChange={(e) => setStartedByName(e.target.value)} maxLength={120} placeholder="Your name or your group's name" />
            </FormField>
            <FormField label="Photo (optional)">
              <ImageUpload previewUrl={photo.url} onChange={(upload) => setPhoto(upload ? { key: upload.key, url: upload.url } : { key: null, url: null })} />
            </FormField>
          </FormSection>

          <FormSection title="What would help" hint="Choose everything that applies.">
            <div className="flex flex-wrap gap-2">
              {needs.map((need) => {
                const on = selectedNeeds.includes(need);
                return (
                  <button
                    key={need}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSelectedNeeds((cur) => (on ? cur.filter((n) => n !== need) : [...cur, need]))}
                    className={`rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition ${
                      on ? 'border-teal bg-teal text-cream' : 'border-border bg-white text-muted hover:border-teal/50 hover:text-ink'
                    }`}
                  >
                    {needLabel[need]}
                  </button>
                );
              })}
            </div>
            <FormField label="Say a little more (optional)">
              <Textarea value={needsNote} onChange={(e) => setNeedsNote(e.target.value)} maxLength={1000} placeholder="e.g. Weekend volunteers for planting drives, plus tree guards." />
            </FormField>
          </FormSection>

          <FormSection title="How supporters reach you" hint="Shown publicly once approved. At least one is needed.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="WhatsApp number, with country code">
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={20} placeholder="+91 98765 43210" inputMode="tel" />
              </FormField>
              <FormField label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
              </FormField>
            </div>
            <FormField label="Website or social page">
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={500} placeholder="https://…" />
            </FormField>
          </FormSection>

          {error && <p role="alert" className="rounded-md bg-saffron-light px-4 py-3 text-sm text-ember">{error}</p>}
          <Button type="submit" disabled={busy || !title.trim() || !summary.trim()} className="justify-self-start">
            {busy ? 'Submitting…' : editingId ? 'Resubmit for review' : 'Submit for review'}
          </Button>
        </form>
      )}
    </JoinLayout>
  );
}
