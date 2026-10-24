import { ArrowRight, Globe, Mail, MapPin, MessageCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mediaUrl } from '../../../api/apiClient';
import { PhotoImage } from '../../../components/ui/PhotoImage';
import type { Initiative } from '../../../types/api';
import { contactLinks } from '../api/initiativesApi';
import { kindLabel } from '../labels';
import { NeedChips } from './InitiativeCard';
import { SupportButton } from './SupportButton';

const contactIcon = { whatsapp: MessageCircle, email: Mail, website: Globe };

/** Wide, action-first card: visitors can see what is needed and reach out without opening the page. */
export function InitiativeRow({ initiative }: { initiative: Initiative }) {
  const [primary, ...secondary] = contactLinks(initiative);

  return (
    <article className="group grid overflow-hidden rounded-xl border border-teal/15 bg-white shadow-card transition duration-300 hover:shadow-card-hover sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <Link to={`/initiatives/${initiative.slug}`} className="relative block aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[260px]">
        <PhotoImage src={mediaUrl(initiative.photoUrl) ?? undefined} alt="" className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-pill bg-teal-dark/85 px-3 py-1 text-xs font-semibold text-teal-light backdrop-blur-sm">
          {kindLabel[initiative.kind]}
        </span>
      </Link>

      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-teal" /> {initiative.cityName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} className="text-teal" /> {initiative.supporters} supporters
          </span>
          {initiative.startedYear && <span>since {initiative.startedYear}</span>}
        </div>

        <Link to={`/initiatives/${initiative.slug}`}>
          <h3 className="mt-2 font-display text-2xl leading-snug text-ink transition group-hover:text-teal">{initiative.title}</h3>
        </Link>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{initiative.summary}</p>

        {(initiative.needs.length > 0 || initiative.needsNote) && (
          <div className="mt-4 rounded-lg bg-teal-light/70 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Looking for</p>
            {initiative.needs.length > 0 && (
              <div className="mt-2">
                <NeedChips initiative={initiative} tone="paper" />
              </div>
            )}
            {initiative.needsNote && <p className="mt-2 text-sm leading-relaxed text-ink/80">{initiative.needsNote}</p>}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {primary && (
            <a
              href={primary.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal-dark"
            >
              {(() => {
                const Icon = contactIcon[primary.key];
                return <Icon size={16} />;
              })()}
              Reach out on {primary.label}
            </a>
          )}
          {secondary.map((option) => {
            const Icon = contactIcon[option.key];
            return (
              <a
                key={option.key}
                href={option.href}
                target="_blank"
                rel="noreferrer"
                aria-label={option.label}
                title={option.label}
                className="grid h-10 w-10 place-items-center rounded-md border border-teal/20 text-teal transition hover:border-teal/50 hover:bg-teal-light/60"
              >
                <Icon size={16} />
              </a>
            );
          })}
          <SupportButton initiative={initiative} size="sm" />
          <Link to={`/initiatives/${initiative.slug}`} className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark">
            Details <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
