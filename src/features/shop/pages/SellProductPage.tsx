import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select, Textarea } from '../../../components/ui/Form';
import type { ShopCategory, ShopDelivery } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { joinApi, type MyListing } from '../../join/api/joinApi';
import { CityPicker, type PickedCity } from '../../join/components/CityPicker';
import { ImageUpload } from '../../join/components/ImageUpload';
import { FormSection, JoinLayout } from '../../join/components/JoinLayout';
import { RejectionNotice, SubmittedNotice } from '../../join/components/SubmissionNotices';
import { deliveryLabel, shopCategoryLabel, shopRules } from '../api/shopApi';

const categories = Object.keys(shopCategoryLabel) as ShopCategory[];
const deliveries = Object.keys(deliveryLabel) as ShopDelivery[];

export function SellProductPage() {
  const { id } = useParams();
  const editingId = id ? Number(id) : null;
  const { user } = useAuth();
  const existing = useQuery({ queryKey: ['own-product', editingId], queryFn: () => joinApi.ownProduct(editingId!), enabled: Boolean(user && editingId) });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ShopCategory>('FOOD');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [delivery, setDelivery] = useState<ShopDelivery>('PICKUP');
  const [city, setCity] = useState<PickedCity | null>(null);
  const [sellerName, setSellerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [photo, setPhoto] = useState<{ key: string | null; url: string | null }>({ key: null, url: null });
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<MyListing | null>(null);

  useEffect(() => {
    const p = existing.data?.product;
    if (!p) return;
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description ?? '');
    setPrice(p.priceAmount != null ? String(p.priceAmount) : '');
    setPriceNote(p.priceNote ?? '');
    setDelivery(p.delivery);
    setCity({ id: p.cityId, name: p.cityName, lat: null, lng: null });
    setSellerName(p.sellerName);
    setWhatsapp(p.contactWhatsapp ?? '');
    setPhone(p.contactPhone ?? '');
    setEmail(p.contactEmail ?? '');
    setWebsite(p.contactWebsite ?? '');
    setPhoto({ key: existing.data?.proofKey ?? null, url: p.photoUrl });
  }, [existing.data]);

  useEffect(() => {
    if (!editingId && user?.name) setSellerName((current) => current || user.name || '');
  }, [editingId, user]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!city) return setError('Please choose the city you sell from.');
    if (!whatsapp.trim() && !phone.trim() && !email.trim() && !website.trim()) return setError('Please add at least one way for buyers to reach you.');
    if (!agreed) return setError('Please confirm the shop rules.');
    setBusy(true);
    setError(null);
    const body = {
      title,
      category,
      description,
      priceAmount: price ? Number(price) : undefined,
      priceNote,
      delivery,
      cityId: city.id,
      sellerName,
      contactWhatsapp: whatsapp,
      contactPhone: phone,
      contactEmail: email || undefined,
      contactWebsite: website,
      photoKey: photo.key ?? undefined,
      rulesConfirmed: agreed,
    };
    try {
      setSubmitted(editingId ? await joinApi.updateProduct(editingId, body) : await joinApi.submitProduct(body));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit.');
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <JoinLayout title="Thank you" subtitle="your item is with our reviewers" back={{ to: '/shop', label: 'Sangha Shop' }}>
        <SubmittedNotice listing={submitted} />
      </JoinLayout>
    );
  }

  return (
    <JoinLayout
      title={editingId ? 'Update your item' : 'Sell in the Sangha Shop'}
      subtitle="something you make, grow or write"
      back={{ to: '/shop', label: 'Sangha Shop' }}
      intro="Buyers contact you directly and you agree payment and delivery between you. A volunteer reviews every item before it appears."
    >
      {existing.data?.status === 'REJECTED' && <RejectionNotice reason={existing.data.rejectionReason} />}
      {existing.data?.status === 'APPROVED' ? (
        <p className="rounded-md bg-leaf/10 px-4 py-3 text-sm text-leaf">
          This item is listed. To change it, please write to us through <Link to="/feedback" className="font-semibold underline">Feedback</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="grid gap-6">
          <FormSection title="What you are selling">
            <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
              <FormField label="Name of the item">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={150} placeholder="e.g. Cold-pressed groundnut oil" />
              </FormField>
              <FormField label="Category">
                <Select value={category} onChange={(e) => setCategory(e.target.value as ShopCategory)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{shopCategoryLabel[c]}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="Description (optional)">
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={3000} placeholder="How it is made, size or quantity, anything a buyer should know…" />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-[1fr_1.5fr]">
              <FormField label="Price in ₹ (optional)">
                <Input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" placeholder="420" />
              </FormField>
              <FormField label="Price note (optional)">
                <Input value={priceNote} onChange={(e) => setPriceNote(e.target.value)} maxLength={60} placeholder="per litre, or 'Price on request'" />
              </FormField>
            </div>
            <FormField label="Photo (optional)">
              <ImageUpload previewUrl={photo.url} onChange={(upload) => setPhoto(upload ? { key: upload.key, url: upload.url } : { key: null, url: null })} />
            </FormField>
          </FormSection>

          <FormSection title="Where and how">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="City you sell from">
                <CityPicker value={city} onChange={setCity} />
              </FormField>
              <FormField label="Delivery">
                <Select value={delivery} onChange={(e) => setDelivery(e.target.value as ShopDelivery)}>
                  {deliveries.map((d) => (
                    <option key={d} value={d}>{deliveryLabel[d]}</option>
                  ))}
                </Select>
              </FormField>
            </div>
            <FormField label="Seller name (shown publicly)">
              <Input value={sellerName} onChange={(e) => setSellerName(e.target.value)} maxLength={120} placeholder="Your name or your small brand" />
            </FormField>
          </FormSection>

          <FormSection title="How buyers reach you" hint="Shown publicly once approved. At least one is needed.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="WhatsApp number, with country code">
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} maxLength={20} placeholder="+91 98765 43210" inputMode="tel" />
              </FormField>
              <FormField label="Phone">
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} inputMode="tel" />
              </FormField>
              <FormField label="Email">
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
              </FormField>
              <FormField label="Website or shop page">
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={500} placeholder="https://…" />
              </FormField>
            </div>
          </FormSection>

          <FormSection title="Shop rules">
            <ul className="list-disc space-y-1 pl-5 text-[15px] text-ink/80">
              {shopRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
            <label className="flex items-start gap-3 rounded-md border border-border bg-white p-4 text-[15px]">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 accent-saffron" />
              <span>This item follows the rules above: it is mine to sell, not Isha-branded and not presented as consecrated.</span>
            </label>
          </FormSection>

          {error && <p role="alert" className="rounded-md bg-saffron-light px-4 py-3 text-sm text-ember">{error}</p>}
          <Button type="submit" disabled={busy || !title.trim()} className="justify-self-start">
            {busy ? 'Submitting…' : editingId ? 'Resubmit for review' : 'Submit for review'}
          </Button>
        </form>
      )}
    </JoinLayout>
  );
}
