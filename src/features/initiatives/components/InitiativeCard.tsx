import { MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PhotoImage, unsplash } from '../../../components/ui/PhotoImage';
import { kindLabel, needLabel, type Initiative } from '../data/sampleInitiatives';

export function NeedChips({ initiative, tone = 'light' }: { initiative: Initiative; tone?: 'light' | 'paper' }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {initiative.needs.map((need) => (
        <span
          key={need}
          className={`rounded-pill border px-2.5 py-0.5 text-xs font-semibold ${
            tone === 'light' ? 'border-teal/20 bg-teal/5 text-teal' : 'border-teal/25 bg-white text-teal'
          }`}
        >
          {needLabel[need]}
        </span>
      ))}
    </div>
  );
}

export function InitiativeCard({ initiative }: { initiative: Initiative }) {
  return (
    <Link
      to={`/initiatives/${initiative.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <PhotoImage src={unsplash(initiative.imageId, 800)} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 pt-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">{kindLabel[initiative.kind]}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-medium leading-snug group-hover:text-saffron-dark">{initiative.title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{initiative.summary}</p>
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Looking for</p>
          <NeedChips initiative={initiative} />
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-gold" /> {initiative.place.name}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} /> {initiative.supporters} supporters
          </span>
        </div>
      </div>
    </Link>
  );
}
