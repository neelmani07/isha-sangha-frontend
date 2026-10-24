import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CalendarDays, Globe, Mail, MapPin, MessageCircle, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { mediaUrl } from '../../../api/apiClient';
import { PhotoImage } from '../../../components/ui/PhotoImage';
import { NotFoundPage } from '../../../pages/NotFoundPage';
import { AuthorChip } from '../../stories/components/AuthorChip';
import { contactLinks, initiativesApi } from '../api/initiativesApi';
import { InitiativeCard, NeedChips } from '../components/InitiativeCard';
import { SupportButton } from '../components/SupportButton';
import { kindLabel } from '../labels';

const contactIcon = { whatsapp: MessageCircle, email: Mail, website: Globe };

export function InitiativePage() {
  const { slug = '' } = useParams();
  const { data: initiative, isLoading, isError } = useQuery({ queryKey: ['initiative', slug], queryFn: () => initiativesApi.bySlug(slug) });
  const others = useQuery({ queryKey: ['initiatives'], queryFn: initiativesApi.list });

  if (isError) {
    return <NotFoundPage />;
  }
  if (isLoading || !initiative) {
    return <div className="min-h-[60vh] bg-teal-texture" aria-busy="true" />;
  }

  const more = (others.data ?? []).filter((item) => item.slug !== initiative.slug).slice(0, 3);
  const contacts = contactLinks(initiative);

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden pt-[var(--header-h)]">
        <PhotoImage src={mediaUrl(initiative.photoUrl) ?? undefined} alt="" className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-teal-deep/95 via-teal-deep/60 to-ink/20" />
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
          {initiative.description && (
            <div className="space-y-5 text-lg leading-relaxed text-ink/90">
              {initiative.description.split(/\n{2,}/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
          {(initiative.needs.length > 0 || initiative.needsNote) && (
            <div className="mt-10 rounded-lg border border-teal/20 bg-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">How you can help</p>
              {initiative.needsNote && <p className="mt-3 text-[17px] leading-relaxed text-ink">{initiative.needsNote}</p>}
              {initiative.needs.length > 0 && (
                <div className="mt-4">
                  <NeedChips initiative={initiative} tone="paper" />
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-white p-6 shadow-card">
            {initiative.startedByName && <AuthorChip name={initiative.startedByName} detail="Started this initiative" />}
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted">
                <MapPin size={15} className="text-gold" />
                <Link to={`/city/${initiative.citySlug}`} className="font-semibold text-ink hover:text-saffron-dark">
                  {initiative.cityName}
                </Link>
              </div>
              {initiative.startedYear && (
                <div className="flex items-center gap-2 text-muted">
                  <CalendarDays size={15} className="text-gold" /> Since {initiative.startedYear}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted">
                <Users size={15} className="text-gold" /> {initiative.supporters} supporters
              </div>
            </dl>
            <div className="mt-6 grid gap-2">
              {contacts.map((contact, index) => {
                const Icon = contactIcon[contact.key];
                return (
                  <a
                    key={contact.key}
                    href={contact.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold transition ${
                      index === 0 ? 'bg-teal text-cream hover:bg-teal-dark' : 'border border-border bg-white text-ink hover:border-teal/40'
                    }`}
                  >
                    <Icon size={16} />
                    {index === 0 ? `Reach out on ${contact.label}` : contact.label}
                  </a>
                );
              })}
              <div className="pt-2">
                <SupportButton initiative={initiative} />
              </div>
            </div>
          </div>
        </aside>
      </section>

      {more.length > 0 && (
        <section className="bg-teal-light/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl">More initiatives</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((item) => (
                <InitiativeCard key={item.slug} initiative={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
