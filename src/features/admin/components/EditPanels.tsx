import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { FormField, Input, Select, Textarea } from '../../../components/ui/Form';
import { centreTypeLabel, teachingModeLabel } from '../../../content/copy';
import type { CenterType, TeachingMode } from '../../../types/api';
import { LocationPicker } from '../../join/components/LocationPicker';
import { adminApi, type ManageRow } from '../api/adminApi';

type Pin = { lat: number; lng: number } | null;

function PanelShell({ busy, error, onSave, onCancel, children }: { busy: boolean; error: string | null; onSave: () => void; onCancel: () => void; children: ReactNode }) {
  return (
    <div className="mt-4 grid gap-4 rounded-lg border border-border bg-cream p-4">
      {children}
      {error && <p className="text-sm text-ember">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onSave} disabled={busy} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50">
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" onClick={onCancel} className="px-3 py-2 text-sm font-semibold text-muted">
          Cancel
        </button>
      </div>
    </div>
  );
}

function useSave(onDone: () => void) {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await action();
      await queryClient.invalidateQueries({ queryKey: ['manage'] });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, run };
}

const pinOf = (lat: number | null | undefined, lng: number | null | undefined): Pin => (lat != null && lng != null ? { lat, lng } : null);

export function CentreEditPanel({ row, onDone }: { row: ManageRow; onDone: () => void }) {
  const { data } = useQuery({ queryKey: ['manage-centre', row.id], queryFn: () => adminApi.centerDetails(row.id) });
  const [form, setForm] = useState({ name: '', type: 'CITY_CENTER' as CenterType, address: '', description: '', openingHours: '', phone: '', email: '', website: '', languages: '', verified: false });
  const [pin, setPin] = useState<Pin>(null);
  const save = useSave(onDone);

  useEffect(() => {
    if (!data) return;
    setForm({ name: data.name, type: data.type, address: data.address ?? '', description: data.description ?? '', openingHours: data.openingHours ?? '', phone: data.phone ?? '', email: data.email ?? '', website: data.website ?? '', languages: data.languages ?? '', verified: data.verified });
    setPin(pinOf(data.latitude, data.longitude));
  }, [data]);

  if (!data) return <p className="mt-4 text-sm text-muted">Loading…</p>;
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <PanelShell
      {...save}
      onCancel={onDone}
      onSave={() =>
        save.run(() =>
          adminApi.updateCenter(row.id, {
            ...form,
            cityId: data.cityId,
            slug: data.slug,
            photoUrl: data.photoUrl,
            active: data.active,
            latitude: pin?.lat,
            longitude: pin?.lng,
          }),
        )
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Name"><Input value={form.name} onChange={set('name')} /></FormField>
        <FormField label="Type">
          <Select value={form.type} onChange={set('type')}>
            {(Object.keys(centreTypeLabel) as CenterType[]).map((t) => <option key={t} value={t}>{centreTypeLabel[t]}</option>)}
          </Select>
        </FormField>
        <FormField label="Address"><Input value={form.address} onChange={set('address')} /></FormField>
        <FormField label="Opening hours"><Input value={form.openingHours} onChange={set('openingHours')} /></FormField>
        <FormField label="Phone"><Input value={form.phone} onChange={set('phone')} /></FormField>
        <FormField label="Email"><Input value={form.email} onChange={set('email')} /></FormField>
        <FormField label="Website"><Input value={form.website} onChange={set('website')} /></FormField>
        <FormField label="Languages"><Input value={form.languages} onChange={set('languages')} /></FormField>
      </div>
      <FormField label="Description"><Textarea value={form.description} onChange={set('description')} /></FormField>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={form.verified} onChange={(e) => setForm((f) => ({ ...f, verified: e.target.checked }))} /> Verified badge
      </label>
      {pin && <FormField label="Location: click the map to move the pin"><LocationPicker center={pin} value={pin} onChange={setPin} kind={form.type} /></FormField>}
    </PanelShell>
  );
}

export function TeacherEditPanel({ row, onDone }: { row: ManageRow; onDone: () => void }) {
  const { data } = useQuery({ queryKey: ['manage-teacher', row.id], queryFn: () => adminApi.teacherDetails(row.id) });
  const [form, setForm] = useState({ name: '', bio: '', phone: '', email: '', website: '', languages: '', yearsTeaching: '', teachingMode: 'IN_PERSON' as TeachingMode, verified: false });
  const [pin, setPin] = useState<Pin>(null);
  const save = useSave(onDone);

  useEffect(() => {
    if (!data) return;
    setForm({ name: data.name, bio: data.bio ?? '', phone: data.phone ?? '', email: data.email ?? '', website: data.website ?? '', languages: data.languages ?? '', yearsTeaching: data.yearsTeaching != null ? String(data.yearsTeaching) : '', teachingMode: data.teachingMode, verified: data.verified });
    setPin(pinOf(data.latitude, data.longitude));
  }, [data]);

  if (!data) return <p className="mt-4 text-sm text-muted">Loading…</p>;
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <PanelShell
      {...save}
      onCancel={onDone}
      onSave={() =>
        save.run(() =>
          adminApi.updateTeacher(row.id, {
            ...form,
            yearsTeaching: form.yearsTeaching ? Number(form.yearsTeaching) : null,
            cityId: data.cityId,
            slug: data.slug,
            photoUrl: data.photoUrl,
            active: data.active,
            programIds: data.programs.map((p) => p.id),
            latitude: pin?.lat,
            longitude: pin?.lng,
          }),
        )
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label="Name"><Input value={form.name} onChange={set('name')} /></FormField>
        <FormField label="Teaches">
          <Select value={form.teachingMode} onChange={set('teachingMode')}>
            {(Object.keys(teachingModeLabel) as TeachingMode[]).map((m) => <option key={m} value={m}>{teachingModeLabel[m]}</option>)}
          </Select>
        </FormField>
        <FormField label="Phone"><Input value={form.phone} onChange={set('phone')} /></FormField>
        <FormField label="Email"><Input value={form.email} onChange={set('email')} /></FormField>
        <FormField label="Website"><Input value={form.website} onChange={set('website')} /></FormField>
        <FormField label="Languages"><Input value={form.languages} onChange={set('languages')} /></FormField>
        <FormField label="Years teaching"><Input value={form.yearsTeaching} onChange={set('yearsTeaching')} inputMode="numeric" /></FormField>
      </div>
      <FormField label="About"><Textarea value={form.bio} onChange={set('bio')} /></FormField>
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={form.verified} onChange={(e) => setForm((f) => ({ ...f, verified: e.target.checked }))} /> Verified badge
      </label>
      {pin && <FormField label="Location: click the map to move the pin"><LocationPicker center={pin} value={pin} onChange={setPin} kind="TEACHER" /></FormField>}
    </PanelShell>
  );
}

export function CityEditPanel({ row, onDone }: { row: ManageRow; onDone: () => void }) {
  const { data } = useQuery({ queryKey: ['manage-city', row.id], queryFn: () => adminApi.cityDetails(row.id) });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pin, setPin] = useState<Pin>(null);
  const save = useSave(onDone);

  useEffect(() => {
    if (!data) return;
    setName(data.name);
    setDescription(data.description ?? '');
    setPin(pinOf(data.latitude, data.longitude));
  }, [data]);

  if (!data) return <p className="mt-4 text-sm text-muted">Loading…</p>;

  return (
    <PanelShell
      {...save}
      onCancel={onDone}
      onSave={() =>
        save.run(() =>
          adminApi.updateCity(row.id, {
            countryId: data.countryId,
            stateId: data.stateId,
            slug: data.slug,
            name,
            description,
            heroImageUrl: data.heroImageUrl,
            active: data.active,
            latitude: pin?.lat,
            longitude: pin?.lng,
          }),
        )
      }
    >
      <FormField label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></FormField>
      <FormField label="Description"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></FormField>
      {pin && <FormField label="City centre: click the map to move the pin"><LocationPicker center={pin} value={pin} onChange={setPin} kind="CITY" /></FormField>}
    </PanelShell>
  );
}
