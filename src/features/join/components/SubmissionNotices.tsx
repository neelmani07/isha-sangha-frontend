import { AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ListingKind, MyListing } from '../api/joinApi';

const afterReview: Record<ListingKind, string> = {
  TEACHER: 'Once your proof is checked, it will appear on the map with a verified badge.',
  CENTER: 'Once your proof is checked, it will appear on the map with a verified badge.',
  INITIATIVE: 'Once approved, it will appear on the Initiatives page and supporters can reach you directly.',
  RESOURCE: 'Once approved, it will appear in the Resources library.',
  CITY: 'Once confirmed, it will appear on the map.',
  STORY: 'Once a volunteer has read it, it will be published on the Stories page.',
  PRODUCT: 'Once approved, it will appear in the Sangha Shop and buyers can contact you directly.',
};

export function SubmittedNotice({ listing }: { listing: MyListing }) {
  return (
    <div className="rounded-xl border border-gold/40 bg-gold-light/40 p-6 sm:p-8">
      <p className="inline-flex items-center gap-2 font-display text-2xl text-maroon">
        <Clock size={22} /> Waiting for review
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
        <strong>{listing.name}</strong>
        {listing.cityName ? ` in ${listing.cityName}` : ''} has been sent to our volunteer reviewers. {afterReview[listing.kind]} If
        anything needs changing, you'll see the reason on your listings page.
      </p>
      <Link
        to="/me"
        className="mt-5 inline-flex rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-cream hover:bg-saffron-dark"
      >
        See my listings
      </Link>
    </div>
  );
}

export function RejectionNotice({ reason }: { reason: string | null }) {
  return (
    <div className="mb-6 rounded-xl border border-ember/30 bg-saffron-light p-5">
      <p className="inline-flex items-center gap-2 font-semibold text-ember">
        <AlertTriangle size={18} /> Our reviewers asked for a change
      </p>
      {reason && <p className="mt-2 text-[15px] text-ink/80">“{reason}”</p>}
      <p className="mt-2 text-sm text-muted">Update the details below and resubmit.</p>
    </div>
  );
}
