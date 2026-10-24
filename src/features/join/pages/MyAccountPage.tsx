import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, Clock, Eye, EyeOff, PenLine, Plus, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ApiError } from '../../../api/apiClient';
import { symbolFor } from '../../../components/maps/mapSymbols';
import { useAuth } from '../../auth/context/AuthContext';
import { joinApi, type ListingStatus, type MyListing } from '../api/joinApi';
import { JoinLayout } from '../components/JoinLayout';

const statusStyle: Record<ListingStatus, { label: string; className: string; icon: typeof Clock }> = {
  PENDING: { label: 'Waiting for review', className: 'bg-gold-light text-maroon', icon: Clock },
  APPROVED: { label: 'Live on the map', className: 'bg-leaf/10 text-leaf', icon: CheckCircle2 },
  REJECTED: { label: 'Needs changes', className: 'bg-saffron-light text-ember', icon: XCircle },
};

export function MyAccountPage() {
  const { user } = useAuth();
  const meditator = useQuery({
    queryKey: ['my-meditator'],
    queryFn: async () => {
      try {
        return await joinApi.myMeditator();
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
      }
    },
    enabled: Boolean(user),
  });
  const listings = useQuery({ queryKey: ['my-listings'], queryFn: joinApi.myListings, enabled: Boolean(user) });

  return (
    <JoinLayout title="Your profile" subtitle="and what you've added" back={null} intro={user ? `Signed in as ${user.email}` : undefined}>
      <div className="grid gap-8">
        <section>
          <h2 className="font-display text-2xl">Meditator profile</h2>
          {meditator.data ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-white p-5 shadow-card">
              <div>
                <p className="font-display text-xl">{meditator.data.displayName}</p>
                <p className="mt-1 text-sm text-muted">
                  {meditator.data.cityName}
                  {meditator.data.practices.length > 0 && ` · ${meditator.data.practices.join(', ')}`}
                </p>
                <p className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${meditator.data.visible ? 'text-leaf' : 'text-muted'}`}>
                  {meditator.data.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  {meditator.data.visible ? 'Visible on the map' : 'Hidden from others'}
                </p>
              </div>
              <Link to="/join/meditator" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold hover:border-saffron/40">
                <PenLine size={15} /> Edit
              </Link>
            </div>
          ) : (
            !meditator.isLoading && (
              <Link
                to="/join/meditator"
                className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-white p-5 text-muted hover:border-saffron/40 hover:text-ink"
              >
                <span>You're not on the map yet. Add yourself as a meditator.</span>
                <ArrowRight size={18} />
              </Link>
            )
          )}
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl">Teachers and places you've submitted</h2>
            <Link to="/join" className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-dark hover:text-saffron">
              <Plus size={16} /> Add another
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {listings.data?.length === 0 && <p className="text-sm text-muted">Nothing yet.</p>}
            {listings.data?.map((listing) => <ListingRow key={`${listing.kind}-${listing.id}`} listing={listing} />)}
          </div>
        </section>
      </div>
    </JoinLayout>
  );
}

function ListingRow({ listing }: { listing: MyListing }) {
  const status = statusStyle[listing.status];
  const kind = listing.kind === 'TEACHER' ? 'teacher' : 'center';
  const symbol = symbolFor(listing.kind === 'TEACHER' ? 'TEACHER' : 'CITY_CENTER');

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: symbol.color }}>
            {listing.kind === 'TEACHER' ? 'Teacher' : 'Place'}
          </p>
          <p className="mt-1 font-display text-xl">{listing.name}</p>
          <p className="text-sm text-muted">{listing.cityName}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-xs font-semibold ${status.className}`}>
          <status.icon size={14} /> {status.label}
        </span>
      </div>
      {listing.status === 'REJECTED' && listing.rejectionReason && (
        <p className="mt-3 rounded-md bg-saffron-light/60 px-3 py-2 text-sm text-ink/80">Reviewer's note: “{listing.rejectionReason}”</p>
      )}
      <div className="mt-4 flex gap-4 text-sm font-semibold">
        {listing.status === 'APPROVED' ? (
          <Link to={`/${kind}/${listing.slug}`} className="text-saffron-dark hover:text-saffron">View public page</Link>
        ) : (
          <Link to={`/join/${kind}/${listing.id}`} className="text-saffron-dark hover:text-saffron">
            {listing.status === 'REJECTED' ? 'Fix and resubmit' : 'Edit while waiting'}
          </Link>
        )}
      </div>
    </div>
  );
}
