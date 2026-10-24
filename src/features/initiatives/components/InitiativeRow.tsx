import { ArrowRight, Globe, Mail, MapPin, MessageCircle, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhotoImage, unsplash } from '../../../components/ui/PhotoImage';
import { kindLabel, type Initiative } from '../data/sampleInitiatives';
import { NeedChips } from './InitiativeCard';

export function contactOptions(initiative: Initiative) {
  return [
    initiative.contact.whatsapp && { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    initiative.contact.email && { key: 'email', label: 'Email', icon: Mail },
    initiative.contact.website && { key: 'website', label: 'Website', icon: Globe },
  ].filter(Boolean) as { key: string; label: string; icon: typeof Mail }[];
}

/** Wide, action-first card: visitors can see what is needed and reach out without opening the page. */
export function InitiativeRow({ initiative }: { initiative: Initiative }) {
  const [contactNote, setContactNote] = useState(false);
  const [primary, ...secondary] = contactOptions(initiative);

  return (
    <article className="group grid overflow-hidden rounded-xl border border-teal/15 bg-white shadow-card transition duration-300 hover:shadow-card-hover sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <Link to={`/initiatives/${initiative.slug}`} className="relative block aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[260px]">
        <PhotoImage src={unsplash(initiative.imageId, 800)} alt="" className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-pill bg-teal-dark/85 px-3 py-1 text-xs font-semibold text-teal-light backdrop-blur-sm">
          {kindLabel[initiative.kind]}
        </span>
      </Link>

      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-teal" /> {initiative.place.name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} className="text-teal" /> {initiative.supporters} supporters
          </span>
          <span>since {initiative.startedIn}</span>
        </div>

        <Link to={`/initiatives/${initiative.slug}`}>
          <h3 className="mt-2 font-display text-2xl leading-snug text-ink transition group-hover:text-teal">{initiative.title}</h3>
        </Link>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{initiative.summary}</p>

        <div className="mt-4 rounded-lg bg-teal-light/70 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">Looking for</p>
          <div className="mt-2">
            <NeedChips initiative={initiative} tone="paper" />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">{initiative.needsNote}</p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {primary && (
            <button
              type="button"
              onClick={() => setContactNote(true)}
              className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-teal-dark"
            >
              <primary.icon size={16} /> Support via {primary.label}
            </button>
          )}
          {secondary.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setContactNote(true)}
              aria-label={option.label}
              title={option.label}
              className="grid h-10 w-10 place-items-center rounded-md border border-teal/20 text-teal transition hover:border-teal/50 hover:bg-teal-light/60"
            >
              <option.icon size={16} />
            </button>
          ))}
          <Link
            to={`/initiatives/${initiative.slug}`}
            className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-dark"
          >
            Details <ArrowRight size={15} />
          </Link>
        </div>
        {contactNote && (
          <p role="status" className="mt-2 text-sm text-muted">
            This is a sample listing, so contact links are switched off.
          </p>
        )}
      </div>
    </article>
  );
}
