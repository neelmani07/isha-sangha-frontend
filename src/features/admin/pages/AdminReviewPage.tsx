import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Check, ExternalLink, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { symbolFor } from '../../../components/maps/mapSymbols';
import type { ListingStatus } from '../../join/api/joinApi';
import { adminApi, type ReviewItem } from '../api/adminApi';

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
        <p className="mt-2 text-muted">Check each proof, then approve (it goes live with a verified badge) or send it back with a note.</p>

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

  const listing = item.teacher ?? item.center;
  if (!listing) return null;
  const symbol = symbolFor(item.teacher ? 'TEACHER' : item.center!.type);

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

  const details: [string, string | null | undefined][] = item.teacher
    ? [
        ['Programs', item.teacher.programs.map((p) => p.name).join(', ')],
        ['Teaches', `${item.teacher.teachingMode.replace('_', ' ').toLowerCase()}${item.teacher.yearsTeaching != null ? ` · ${item.teacher.yearsTeaching} yrs` : ''}`],
        ['Languages', item.teacher.languages],
        ['Contact', [item.teacher.phone, item.teacher.email, item.teacher.website].filter(Boolean).join(' · ')],
        ['About', item.teacher.bio],
      ]
    : [
        ['Type', item.center!.type.replace('_', ' ').toLowerCase()],
        ['Address', item.center!.address],
        ['Hours', item.center!.openingHours],
        ['Contact', [item.center!.phone, item.center!.email, item.center!.website].filter(Boolean).join(' · ')],
        ['About', item.center!.description],
      ];

  return (
    <article className="rounded-xl border border-border bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: symbol.color }}>
            {item.teacher ? 'Teacher' : 'Place'} · {listing.cityName}
          </p>
          <p className="mt-1 font-display text-2xl">{listing.name}</p>
          <p className="text-sm text-muted">
            Submitted by {item.submittedByEmail} on {new Date(item.submittedAt).toLocaleDateString('en-IN')}
          </p>
        </div>
        {item.proofKey && (
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
              <dd className="text-ink/90">{value}</dd>
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
