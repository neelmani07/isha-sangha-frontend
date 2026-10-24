import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Lock, MapPin, ThumbsUp } from 'lucide-react';
import type { ResourceLink } from '../../../types/api';
import { useAuth } from '../../auth/context/AuthContext';
import { categoryLabel, resourceLibraryApi } from '../api/resourcesLibraryApi';

export function ResourceCard({ link }: { link: ResourceLink }) {
  const { user, openSignIn } = useAuth();
  const queryClient = useQueryClient();
  const toggle = useMutation({
    mutationFn: () => (link.helpfulByMe ? resourceLibraryApi.unmarkHelpful(link.id) : resourceLibraryApi.markHelpful(link.id)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
  const locked = link.membersOnly && !link.url;

  return (
    <article className="flex flex-col rounded-xl border border-border bg-white p-5 shadow-card transition hover:shadow-card-hover sm:flex-row sm:items-start sm:gap-5">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
          {categoryLabel[link.category]}
          {link.membersOnly && (
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-teal">
              <Lock size={12} /> Members only
            </span>
          )}
          {link.cityName && (
            <span className="inline-flex items-center gap-1 normal-case tracking-normal text-muted">
              <MapPin size={12} /> {link.cityName}
            </span>
          )}
        </p>
        {locked ? (
          <p className="mt-1.5 font-display text-xl leading-snug text-ink">{link.title}</p>
        ) : (
          <a href={link.url!} target="_blank" rel="noreferrer noopener" className="group mt-1.5 inline-flex items-start gap-1.5 font-display text-xl leading-snug text-ink hover:text-saffron-dark">
            {link.title}
            <ExternalLink size={15} className="mt-1.5 shrink-0 text-muted group-hover:text-saffron" />
          </a>
        )}
        {link.description && <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{link.description}</p>}
        {locked ? (
          <button type="button" onClick={openSignIn} className="mt-2 text-sm font-semibold text-teal hover:text-teal-dark">
            Sign in to see this link
          </button>
        ) : (
          link.host && <p className="mt-2 text-xs text-muted">{link.host}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => (user ? toggle.mutate() : openSignIn())}
        disabled={toggle.isPending}
        aria-pressed={link.helpfulByMe}
        className={`mt-4 inline-flex shrink-0 items-center gap-1.5 self-start rounded-pill border px-3 py-1.5 text-sm font-semibold transition sm:mt-0 ${
          link.helpfulByMe ? 'border-gold bg-gold-light text-maroon' : 'border-border bg-white text-muted hover:border-gold/60 hover:text-maroon'
        }`}
      >
        <ThumbsUp size={14} /> {link.helpful > 0 ? link.helpful : ''} Helpful
      </button>
    </article>
  );
}
