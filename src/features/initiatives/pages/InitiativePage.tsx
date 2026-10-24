import { ArrowLeft, CalendarDays, Globe, Mail, MapPin, MessageCircle, Users } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PhotoImage, unsplash } from '../../../components/ui/PhotoImage';
import { SampleNotice } from '../../../components/ui/SampleNotice';
import { NotFoundPage } from '../../../pages/NotFoundPage';
import { AuthorChip } from '../../stories/components/AuthorChip';
import { placeHref } from '../../stories/data/sampleStories';
import { InitiativeCard, NeedChips } from '../components/InitiativeCard';
import { findInitiative, kindLabel, sampleInitiatives } from '../data/sampleInitiatives';

export function InitiativePage() {
  const { slug } = useParams();
  const initiative = findInitiative(slug);
  const [contactNote, setContactNote] = useState(false);

  if (!initiative) {
    return <NotFoundPage />;
  }

  const others = sampleInitiatives.filter((item) => item.slug !== initiative.slug).slice(0, 3);
  const contacts = [
    initiative.contact.whatsapp && { label: 'WhatsApp', icon: MessageCircle, primary: true },
    initiative.contact.email && { label: 'Email', icon: Mail, primary: false },
    initiative.contact.website && { label: 'Website', icon: Globe, primary: false },
  ].filter(Boolean) as { label: string; icon: typeof Mail; primary: boolean }[];

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden pt-[var(--header-h)]">
        <PhotoImage src={unsplash(initiative.imageId, 1800)} alt="" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20" />
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-24 sm:px-6 sm:pt-36 lg:px-8">
          <Link to="/initiatives" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cream/80 hover:text-cream">
            <ArrowLeft size={16} /> All initiatives
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">{kindLabel[initiative.kind]}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-normal leading-tight text-cream sm:text-5xl">{initiative.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-cream/85">{initiative.summary}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div>
          <SampleNotice>Sample initiative for preview</SampleNotice>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink/90">
            {initiative.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 rounded-lg border border-teal/20 bg-teal/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">How you can help</p>
            <p className="mt-3 text-[17px] leading-relaxed text-ink">{initiative.needsNote}</p>
            <div className="mt-4">
              <NeedChips initiative={initiative} tone="paper" />
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-white p-6 shadow-card">
            <AuthorChip name={initiative.startedBy} detail="Started this initiative" />
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <MapPin size={15} className="text-gold" />
                <Link to={placeHref(initiative.place)} className="font-semibold text-ink hover:text-saffron-dark">{initiative.place.name}</Link>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <CalendarDays size={15} className="text-gold" /> Since {initiative.startedIn}
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Users size={15} className="text-gold" /> {initiative.supporters} supporters
              </div>
            </dl>
            <div className="mt-6 grid gap-2">
              {contacts.map((contact) => (
                <button
                  key={contact.label}
                  type="button"
                  onClick={() => setContactNote(true)}
                  className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition ${
                    contact.primary ? 'bg-teal text-cream hover:bg-teal-dark' : 'border border-border bg-white text-ink hover:border-saffron/40'
                  }`}
                >
                  <contact.icon size={16} />
                  {contact.primary ? `Support via ${contact.label}` : contact.label}
                </button>
              ))}
            </div>
            {contactNote && (
              <p role="status" className="mt-3 text-sm text-muted">
                This is a sample listing, so contact links are switched off.
              </p>
            )}
          </div>
        </aside>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl">More initiatives</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <InitiativeCard key={item.slug} initiative={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
