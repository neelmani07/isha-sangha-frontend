import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../../components/ui/Form';
import type { CenterType } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { joinApi, type MyListing } from '../api/joinApi';
import { CityPicker, type PickedCity } from '../components/CityPicker';
import { FormSection, JoinLayout } from '../components/JoinLayout';
import { LocationPicker } from '../components/LocationPicker';
import { ProofUpload } from '../components/ProofUpload';
import { RejectionNotice, SubmittedNotice } from '../components/SubmissionNotices';
import { centreTypeLabel } from '../../../content/copy';

const centerTypes: { value: CenterType; label: string }[] = [
  { value: 'CITY_CENTER', label: centreTypeLabel.CITY_CENTER },
  { value: 'MAJOR_CENTER', label: centreTypeLabel.MAJOR_CENTER },
  { value: 'DEVI_TEMPLE', label: centreTypeLabel.DEVI_TEMPLE },
  { value: 'ISHA_SHOP', label: centreTypeLabel.ISHA_SHOP },
];

export function CenterSubmissionPage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const { user } = useAuth();

  const existing = useQuery({
    queryKey: ['own-center', editingId],
    queryFn: () => joinApi.ownCenter(editingId!),
    enabled: Boolean(user && editingId),
  });

  const [name, setName] = useState('');
  const [type, setType] = useState<CenterType>('CITY_CENTER');
  const [city, setCity] = useState<PickedCity | null>(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [languages, setLanguages] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [proofKey, setProofKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<MyListing | null>(null);

  useEffect(() => {
    const c = existing.data?.center;
    if (!c) return;
    setName(c.name);
    setType(c.type);
    setCity({ id: c.cityId, name: c.cityName, lat: c.latitude, lng: c.longitude });
    setAddress(c.address ?? '');
    setDescription(c.description ?? '');
    setOpeningHours(c.openingHours ?? '');
    setLanguages(c.languages ?? '');
    setPhone(c.phone ?? '');
    setEmail(c.email ?? '');
    setWebsite(c.website ?? '');
    if (c.latitude != null && c.longitude != null) setPin({ lat: c.latitude, lng: c.longitude });
    setProofKey(existing.data?.proofKey ?? null);
  }, [existing.data]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!city) return setError('Please choose the city.');
    if (!pin) return setError('Please pin the exact location on the map.');
    if (!proofKey) return setError('Please attach proof, such as a letter or listing from Isha.');
    setBusy(true);
    setError(null);
    const body = {
      name,
      type,
      cityId: city.id,
      address,
      description,
      openingHours,
      languages,
      phone,
      email,
      website,
      latitude: pin.lat,
      longitude: pin.lng,
      proofKey,
    };
    try {
      setSubmitted(editingId ? await joinApi.updateCenter(editingId, body) : await joinApi.submitCenter(body));
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
      title={editingId ? 'Update your listing' : 'Add a centre, temple or shop'}
      subtitle="so people can find their way to it"
      intro="It appears on the map after a volunteer checks your proof. Approved places get a verified badge."
    >
      {existing.data?.status === 'REJECTED' && <RejectionNotice reason={existing.data.rejectionReason} />}
      {existing.data?.status === 'APPROVED' ? (
        <p className="rounded-md bg-leaf/10 px-4 py-3 text-sm text-leaf">
          This listing is approved and live. To change it, please write to us through{' '}
          <Link to="/feedback" className="font-semibold underline">Feedback</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="grid gap-6">
          <FormSection title="The place">
            <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
              <FormField label="Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} required maxLength={250} placeholder="e.g. Isha Centre, Saibaba Colony" />
              </FormField>
              <FormField label="Type">
                <Select value={type} onChange={(e) => setType(e.target.value as CenterType)}>
                  {centerTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="City">
              <CityPicker value={city} onChange={(c) => { setCity(c); setPin(null); }} />
            </FormField>
            <FormField label="Street address">
              <Input value={address} onChange={(e) => setAddress(e.target.value)} maxLength={500} placeholder="Building, street, area" />
            </FormField>
            {city?.lat != null && city.lng != null && (
              <FormField label="Exact location: click the map to pin the entrance">
                <LocationPicker center={{ lat: city.lat, lng: city.lng }} value={pin} onChange={setPin} kind={type} />
              </FormField>
            )}
            <FormField label="Description (optional)">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={2000} placeholder="What happens here, what visitors should know…" />
            </FormField>
          </FormSection>

          <FormSection title="Visiting" hint="Shown publicly once approved.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Opening hours">
                <Input value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} maxLength={500} placeholder="e.g. Daily 6–8 am, 5–8 pm" />
              </FormField>
              <FormField label="Languages">
                <Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Tamil, English" />
              </FormField>
              <FormField label="Phone / WhatsApp">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={50} />
              </FormField>
              <FormField label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
              </FormField>
            </div>
            <FormField label="Website or social page">
              <Input value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={255} placeholder="https://…" />
            </FormField>
          </FormSection>

          <FormSection title="Proof" hint="For example a letter from Isha, an official listing, or a photo of the signboard with today's date. Required.">
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
