import { useQuery } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../../components/ui/Form';
import type { ResourceCategory } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { joinApi, type MyListing } from '../../join/api/joinApi';
import { CityPicker, type PickedCity } from '../../join/components/CityPicker';
import { FormSection, JoinLayout } from '../../join/components/JoinLayout';
import { RejectionNotice, SubmittedNotice } from '../../join/components/SubmissionNotices';
import { categoryLabel } from '../api/resourcesLibraryApi';

const categories = Object.keys(categoryLabel) as ResourceCategory[];
const CHAT_HOSTS = /(^|\.)(chat\.whatsapp\.com|wa\.me|t\.me|telegram\.me|discord\.gg|signal\.group)$/i;

function looksLikeChatInvite(url: string) {
  try {
    return CHAT_HOSTS.test(new URL(url.startsWith('http') ? url : `https://${url}`).hostname);
  } catch {
    return false;
  }
}

export function SuggestResourcePage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const { user } = useAuth();
  const existing = useQuery({
    queryKey: ['own-resource', editingId],
    queryFn: () => joinApi.ownResource(editingId!),
    enabled: Boolean(user && editingId),
  });

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('PROGRAMMES');
  const [city, setCity] = useState<PickedCity | null>(null);
  const [language, setLanguage] = useState('');
  const [membersOnly, setMembersOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<MyListing | null>(null);

  useEffect(() => {
    const r = existing.data?.resource;
    if (!r) return;
    setTitle(r.title);
    setUrl(r.url ?? '');
    setDescription(r.description ?? '');
    setCategory(r.category);
    setCity(r.cityId ? { id: r.cityId, name: r.cityName ?? '', lat: null, lng: null } : null);
    setLanguage(r.language ?? '');
    setMembersOnly(r.membersOnly);
  }, [existing.data]);

  const forcedMembersOnly = category === 'GROUPS' || looksLikeChatInvite(url);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const body = { title, url, description, category, cityId: city?.id, language, membersOnly: membersOnly || forcedMembersOnly };
    try {
      setSubmitted(editingId ? await joinApi.updateResource(editingId, body) : await joinApi.submitResource(body));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <JoinLayout title="Thank you" subtitle="your link is with our reviewers" back={{ to: '/resources', label: 'Resources' }}>
        <SubmittedNotice listing={submitted} />
      </JoinLayout>
    );
  }

  return (
    <JoinLayout
      title={editingId ? 'Update your link' : 'Suggest a link'}
      subtitle="for the sangha's library"
      back={{ to: '/resources', label: 'Resources' }}
      intro="Share something you found genuinely useful. A volunteer checks every link before it appears."
    >
      {existing.data?.status === 'REJECTED' && <RejectionNotice reason={existing.data.rejectionReason} />}
      {existing.data?.status === 'APPROVED' ? (
        <p className="rounded-md bg-leaf/10 px-4 py-3 text-sm text-leaf">
          This link is approved and live. To change it, please write to us through{' '}
          <Link to="/feedback" className="font-semibold underline">Feedback</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="grid gap-6">
          <FormSection title="The link">
            <FormField label="Web address">
              <Input value={url} onChange={(e) => setUrl(e.target.value)} required maxLength={1000} placeholder="https://…" inputMode="url" />
            </FormField>
            <FormField label="Title">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="e.g. Free Isha Kriya guided meditation" />
            </FormField>
            <FormField label="Why is it useful? (optional)">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category">
                <Select value={category} onChange={(e) => setCategory(e.target.value as ResourceCategory)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{categoryLabel[c]}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Language (optional)">
                <Input value={language} onChange={(e) => setLanguage(e.target.value)} maxLength={60} placeholder="e.g. Tamil" />
              </FormField>
            </div>
            <FormField label="Only for one city? (optional)">
              <CityPicker value={city} onChange={setCity} />
            </FormField>
          </FormSection>

          <div className="rounded-xl border border-teal/20 bg-teal/5 p-5">
            <label className="flex items-start gap-3 text-[15px]">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-[#0b4a63]"
                checked={membersOnly || forcedMembersOnly}
                disabled={forcedMembersOnly}
                onChange={(e) => setMembersOnly(e.target.checked)}
              />
              <span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-teal">
                  <Lock size={14} /> Show to signed-in members only
                </span>
                <span className="block text-sm text-muted">
                  {forcedMembersOnly
                    ? 'Group invite links are always members-only, so they don’t attract spam.'
                    : 'Use this for anything you don’t want the whole internet to see.'}
                </span>
              </span>
            </label>
          </div>

          {error && <p role="alert" className="rounded-md bg-saffron-light px-4 py-3 text-sm text-ember">{error}</p>}
          <Button type="submit" disabled={busy || !title.trim() || !url.trim()} className="justify-self-start">
            {busy ? 'Submitting…' : editingId ? 'Resubmit for review' : 'Submit for review'}
          </Button>
        </form>
      )}
    </JoinLayout>
  );
}
