import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../../components/ui/Form';
import type { StoryCategory } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { joinApi, type MyListing } from '../../join/api/joinApi';
import { CityPicker, type PickedCity } from '../../join/components/CityPicker';
import { ImageUpload } from '../../join/components/ImageUpload';
import { FormSection, JoinLayout } from '../../join/components/JoinLayout';
import { RejectionNotice, SubmittedNotice } from '../../join/components/SubmissionNotices';
import { categoryLabel } from '../api/storiesApi';

const categories = Object.keys(categoryLabel) as StoryCategory[];

function shortName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  return parts.length > 1 ? `${first} ${parts[parts.length - 1].charAt(0).toUpperCase()}.` : first;
}

export function ShareStoryPage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const { user } = useAuth();
  const existing = useQuery({ queryKey: ['own-story', editingId], queryFn: () => joinApi.ownStory(editingId!), enabled: Boolean(user && editingId) });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StoryCategory>('TRANSFORMATION');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [city, setCity] = useState<PickedCity | null>(null);
  const [photo, setPhoto] = useState<{ key: string | null; url: string | null }>({ key: null, url: null });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<MyListing | null>(null);

  useEffect(() => {
    const s = existing.data?.story;
    if (!s) return;
    setTitle(s.title);
    setCategory(s.category);
    setBody(s.body);
    setAuthorName(s.authorName);
    if (s.cityId && s.placeName) setCity({ id: s.cityId, name: s.placeName, lat: null, lng: null });
    setPhoto({ key: existing.data?.proofKey ?? null, url: s.photoUrl });
  }, [existing.data]);

  useEffect(() => {
    if (!editingId && user?.name) setAuthorName((current) => current || shortName(user.name ?? ''));
  }, [editingId, user]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (body.trim().length < 80) return setError('Please write a little more: at least a few sentences.');
    setBusy(true);
    setError(null);
    const payload = {
      title,
      category,
      body,
      authorName,
      cityId: city?.id,
      photoKey: photo.key ?? undefined,
    };
    try {
      setSubmitted(editingId ? await joinApi.updateStory(editingId, payload) : await joinApi.submitStory(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <JoinLayout title="Thank you" subtitle="for sharing your story" back={{ to: '/stories', label: 'Stories' }}>
        <SubmittedNotice listing={submitted} />
      </JoinLayout>
    );
  }

  return (
    <JoinLayout
      title={editingId ? 'Update your story' : 'Share your story'}
      subtitle="it may be exactly what someone needs today"
      back={{ to: '/stories', label: 'Stories' }}
      intro="Write it the way you would tell a friend. A volunteer reads every story before it is published."
    >
      {existing.data?.status === 'REJECTED' && <RejectionNotice reason={existing.data.rejectionReason} />}
      {existing.data?.status === 'APPROVED' ? (
        <p className="rounded-md bg-leaf/10 px-4 py-3 text-sm text-leaf">
          This story is published. To change it, please write to us through <Link to="/feedback" className="font-semibold underline">Feedback</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="grid gap-6">
          <FormSection title="Your story">
            <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <FormField label="Title">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="e.g. The evening the lamp stayed lit" />
              </FormField>
              <FormField label="Kind of story">
                <Select value={category} onChange={(e) => setCategory(e.target.value as StoryCategory)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{categoryLabel[c]}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="Your story">
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                maxLength={12000}
                placeholder="What happened, and what changed for you? Leave a blank line between paragraphs."
                className="min-h-72"
              />
            </FormField>
            <p className="-mt-2 text-xs text-muted">{body.trim().length.toLocaleString()} / 12,000 characters</p>
          </FormSection>

          <FormSection title="Details">
            <FormField label="Name shown with your story">
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} maxLength={120} placeholder="e.g. Meera R." />
            </FormField>
            <FormField label="Where did it happen? (optional)">
              <CityPicker value={city} onChange={setCity} />
            </FormField>
            <FormField label="Photo (optional)">
              <ImageUpload previewUrl={photo.url} onChange={(upload) => setPhoto(upload ? { key: upload.key, url: upload.url } : { key: null, url: null })} />
            </FormField>
          </FormSection>

          {error && <p role="alert" className="rounded-md bg-saffron-light px-4 py-3 text-sm text-ember">{error}</p>}
          <Button type="submit" disabled={busy || !title.trim()} className="justify-self-start">
            {busy ? 'Sending…' : editingId ? 'Resubmit for review' : 'Send for review'}
          </Button>
        </form>
      )}
    </JoinLayout>
  );
}
