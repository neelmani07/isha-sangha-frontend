import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, ExternalLink, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../../api/apiClient';
import { symbolFor } from '../../../components/maps/mapSymbols';
import type { ListingStatus } from '../../join/api/joinApi';
import { adminApi, type ReviewItem } from '../api/adminApi';
import { centreTypeLabel, teachingModeLabel } from '../../../content/copy';
import { kindLabel, needLabel } from '../../initiatives/labels';
import { categoryLabel } from '../../resources/api/resourcesLibraryApi';
import { deliveryLabel, priceText, shopCategoryLabel } from '../../shop/api/shopApi';
import { categoryLabel as storyCategoryLabel } from '../../stories/api/storiesApi';

const tabs: { value: ListingStatus; label: string }[] = [
  { value: 'PENDING', label: 'Waiting' },
  { value: 'REJECTED', label: 'Sent back' },
  { value: 'APPROVED', label: 'Approved' },
];

/** Admin approval queue for member-submitted teachers and centers. */
export function AdminReviewPage() {
  const [status, setStatus] = useState<ListingStatus>('PENDING');
  const queue = useQuery({ queryKey: ['review-queue', status], queryFn: () => adminApi.reviewQueue(status) });

  return (
    <main className="min-h-screen bg-cream p-6 text-ink sm:p-8">
      <div className="mx-auto max-w-4xl">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Admin dashboard
        </Link>
        <h1 className="mt-4 font-display text-4xl">Review submissions</h1>
        <p className="mt-2 text-muted">Check each submission (and its proof, for teachers and places), then approve it or send it back with a note.</p>

        <div className="mt-6 inline-flex rounded-md border border-border bg-white p-1 text-sm font-semibold" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={status === tab.value}
              onClick={() => setStatus(tab.value)}
              className={`rounded px-4 py-2 ${status === tab.value ? 'bg-ink text-cream' : 'text-muted hover:text-ink'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          {queue.isError && (
            <p className="rounded-md bg-saffron-light p-4 text-ember">
              Could not load the queue. <Link to="/admin/login" className="font-semibold underline">Sign in as admin</Link>.
            </p>
          )}
          {queue.data?.length === 0 && <p className="text-muted">Nothing here.</p>}
          {queue.data?.map((item) => <ReviewCard key={`${item.kind}-${item.id}`} item={item} />)}
        </div>
      </div>
    </main>
  );
}

function ReviewCard({ item }: { item: ReviewItem }) {
  const queryClient = useQueryClient();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [proofError, setProofError] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['review-queue'] });
  const approve = useMutation({ mutationFn: () => adminApi.approveListing(item.kind, item.id), onSuccess: refresh });
  const reject = useMutation({ mutationFn: () => adminApi.rejectListing(item.kind, item.id, reason.trim()), onSuccess: refresh });

  const heading = item.teacher?.name ?? item.center?.name ?? item.initiative?.title ?? item.resource?.title ?? item.city?.name ?? item.story?.title ?? item.product?.title;
  if (!heading) return null;
  const where = item.teacher?.cityName ?? item.center?.cityName ?? item.initiative?.cityName ?? item.resource?.cityName ?? item.city?.countryName ?? item.story?.placeName ?? item.product?.cityName;
  const kind = item.teacher ? 'Teacher' : item.center ? 'Place' : item.initiative ? 'Initiative' : item.city ? 'New city' : item.story ? 'Story' : item.product ? 'Shop item' : 'Resource link';
  const color = item.teacher
    ? symbolFor('TEACHER').color
    : item.center
      ? symbolFor(item.center.type).color
      : item.initiative
        ? '#0b4a63'
        : item.story
          ? '#5e2614'
          : '#b8862b';

  async function openProof() {
    if (!item.proofKey) return;
    setProofError(null);
    // Open the tab synchronously (avoids pop-up blockers), then fill it once the file arrives.
    const tab = window.open('', '_blank');
    try {
      const blob = await adminApi.proof(item.proofKey);
      const url = URL.createObjectURL(blob);
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch {
      tab?.close();
      setProofError('Could not open the proof.');
    }
  }

  const details: [string, string | null | undefined][] = item.product
    ? [
        ['Category', shopCategoryLabel[item.product.category]],
        ['Price', priceText(item.product)],
        ['Delivery', deliveryLabel[item.product.delivery]],
        ['Seller', item.product.sellerName],
        ['Contact', [item.product.contactWhatsapp && `WhatsApp +${item.product.contactWhatsapp}`, item.product.contactPhone, item.product.contactEmail, item.product.contactWebsite].filter(Boolean).join(' · ')],
        ['Description', item.product.description],
        ['Rules', 'Seller confirmed: not Isha-branded, not presented as consecrated, theirs to sell'],
      ]
    : item.story
    ? [
        ['Kind', storyCategoryLabel[item.story.category]],
        ['Shown as', item.story.authorName],
        ['Story', item.story.body],
      ]
    : item.city
    ? [
        ['State / region', item.city.stateName],
        ['Country', item.city.countryName],
        ['Location', `${item.city.lat.toFixed(4)}, ${item.city.lng.toFixed(4)}`],
      ]
    : item.initiative
    ? [
        ['Kind', kindLabel[item.initiative.kind]],
        ['Summary', item.initiative.summary],
        ['Needs', item.initiative.needs.map((n) => needLabel[n]).join(', ')],
        ['Started by', item.initiative.startedByName],
        ['Contact', [item.initiative.contactWhatsapp && `WhatsApp +${item.initiative.contactWhatsapp}`, item.initiative.contactEmail, item.initiative.contactWebsite].filter(Boolean).join(' · ')],
        ['Story', item.initiative.description],
      ]
    : item.resource
    ? [
        ['Category', categoryLabel[item.resource.category]],
        ['Link', item.resource.url],
        ['Visibility', item.resource.membersOnly ? 'Members only' : 'Everyone'],
        ['Why useful', item.resource.description],
      ]
    : item.teacher
    ? [
        ['Programmes', item.teacher.programs.map((p) => p.name).join(', ')],
        ['Teaches', `${teachingModeLabel[item.teacher.teachingMode]}${item.teacher.yearsTeaching != null ? ` · ${item.teacher.yearsTeaching} yrs` : ''}`],
        ['Languages', item.teacher.languages],
        ['Contact', [item.teacher.phone, item.teacher.email, item.teacher.website].filter(Boolean).join(' · ')],
        ['About', item.teacher.bio],
      ]
    : [
        ['Type', centreTypeLabel[item.center!.type]],
        ['Address', item.center!.address],
        ['Hours', item.center!.openingHours],
        ['Contact', [item.center!.phone, item.center!.email, item.center!.website].filter(Boolean).join(' · ')],
        ['About', item.center!.description],
      ];

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color }}>
            {kind}
            {where ? ` · ${where}` : ''}
          </p>
          <p className="mt-1 font-display text-2xl">{heading}</p>
          <p className="text-sm text-muted">
            Submitted by {item.submittedByEmail} on {new Date(item.submittedAt).toLocaleDateString('en-IN')}
          </p>
        </div>
        {item.city && (
          <a
            href={`https://www.openstreetmap.org/?mlat=${item.city.lat}&mlon=${item.city.lng}#map=11/${item.city.lat}/${item.city.lng}`}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md border border-gold/50 bg-gold-light/50 px-3 py-2 text-sm font-semibold text-maroon hover:bg-gold-light"
          >
            Check on map <ExternalLink size={13} />
          </a>
        )}
        {item.resource?.url && (
          <a
            href={item.resource.url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-md border border-gold/50 bg-gold-light/50 px-3 py-2 text-sm font-semibold text-maroon hover:bg-gold-light"
          >
            Open link <ExternalLink size={13} />
          </a>
        )}
        {(item.initiative?.photoUrl || item.story?.photoUrl || item.product?.photoUrl) && (
          <a
            href={mediaUrl(item.initiative?.photoUrl ?? item.story?.photoUrl ?? item.product?.photoUrl) ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-ink hover:border-saffron/40"
          >
            View photo <ExternalLink size={13} />
          </a>
        )}
        {item.proofKey && (item.teacher || item.center) && (
          <button
            type="button"
            onClick={openProof}
            className="inline-flex items-center gap-2 rounded-md border border-gold/50 bg-gold-light/50 px-3 py-2 text-sm font-semibold text-maroon hover:bg-gold-light"
          >
            <FileText size={16} /> Open proof <ExternalLink size={13} />
          </button>
        )}
      </div>
      {proofError && <p className="mt-2 text-sm text-ember">{proofError}</p>}

      <dl className="mt-4 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[110px_1fr]">
        {details
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd className="whitespace-pre-line text-ink/90">{value}</dd>
            </div>
          ))}
      </dl>
      {item.rejectionReason && <p className="mt-3 text-sm text-ember">Sent back: “{item.rejectionReason}”</p>}

      {item.status !== 'APPROVED' && (
        <div className="mt-5 border-t border-border pt-4">
          {rejecting ? (
            <div className="grid gap-2">
              <label className="text-sm font-semibold" htmlFor={`reason-${item.kind}-${item.id}`}>
                What should they change? They'll see this note.
              </label>
              <textarea
                id={`reason-${item.kind}-${item.id}`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                className="min-h-24 rounded-md border border-border p-3 text-sm outline-none focus:border-saffron"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!reason.trim() || reject.isPending}
                  onClick={() => reject.mutate()}
                  className="rounded-md bg-ember px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50"
                >
                  Send back
                </button>
                <button type="button" onClick={() => setRejecting(false)} className="px-3 py-2 text-sm font-semibold text-muted">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={approve.isPending}
                onClick={() => approve.mutate()}
                className="inline-flex items-center gap-1.5 rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-cream hover:bg-leaf-light disabled:opacity-50"
              >
                <Check size={16} /> Approve
              </button>
              <button
                type="button"
                onClick={() => setRejecting(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-semibold text-ink hover:border-ember/50 hover:text-ember"
              >
                <X size={16} /> Send back
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
