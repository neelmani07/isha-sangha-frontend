import { useQuery } from '@tanstack/react-query';
import { List, Map as MapIcon, PenLine } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ornament } from '../../../components/brand/Ornament';
import { ClosingBand } from '../../../components/layout/ClosingBand';
import { BackdropPhoto } from '../../../components/ui/BackdropPhoto';
import { TwoToneHeading } from '../../../components/ui/TwoToneHeading';
import { sitePhotos } from '../../../content/sitePhotos';
import { InitiativeRow } from '../components/InitiativeRow';
import { InitiativesMap } from '../components/InitiativesMap';
import type { InitiativeKind } from '../../../types/api';
import { initiativesApi } from '../api/initiativesApi';
import { helpGroups, initiativeKinds, type HelpGroup } from '../labels';

function ListInitiativeLink({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/join/initiative"
      className={`inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-cream shadow-card transition hover:bg-saffron-dark ${className}`}
    >
      <PenLine size={16} /> List your initiative
    </Link>
  );
}

const steps = [
  { title: 'List it', text: 'Describe your venture or seva, where it happens and what would help it grow.' },
  { title: 'We review', text: 'A volunteer moderator checks every listing before it goes live.' },
  { title: 'People reach you', text: 'Supporters contact you directly on WhatsApp, email or your website.' },
];

export function InitiativesPage() {
  const [help, setHelp] = useState<HelpGroup>('ALL');
  const [kind, setKind] = useState<InitiativeKind | 'ALL'>('ALL');
  const [view, setView] = useState<'list' | 'map'>('list');

  const listQuery = useQuery({ queryKey: ['initiatives'], queryFn: initiativesApi.list });
  const statsQuery = useQuery({ queryKey: ['initiative-stats'], queryFn: initiativesApi.stats });

  const initiatives = useMemo(() => {
    const needs = helpGroups.find((group) => group.value === help)?.needs ?? [];
    return (listQuery.data ?? []).filter(
      (item) =>
        (kind === 'ALL' || item.kind === kind) && (needs.length === 0 || item.needs.some((need) => needs.includes(need))),
    );
  }, [help, kind, listQuery.data]);

  const stats = [
    { value: statsQuery.data?.initiatives ?? 0, label: 'initiatives' },
    { value: statsQuery.data?.supporters ?? 0, label: 'supporters' },
    { value: statsQuery.data?.places ?? 0, label: 'places' },
  ];

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden bg-teal-texture pt-[var(--header-h)] text-cream clip-slant-bottom">
        <BackdropPhoto photo={sitePhotos.sadhguru} variant="fade-right" position="35% 25%" className="-z-10 opacity-70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-deep via-teal-deep/75 to-transparent md:via-teal-deep/40" />
        <div className="mx-auto max-w-6xl px-4 pb-36 pt-14 sm:px-6 sm:pt-24 lg:px-8">
          <div className="max-w-xl">
            <TwoToneHeading
              as="h1"
              size="lg"
              tone="light"
              title="Your Initiatives"
              subtitle="seva and ventures started by people like you"
            />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
              Volunteers share what they are building, from free yoga in the park to seed libraries and evening tuition,
              and what kind of support would help.
            </p>
            <div className="mt-8">
              <ListInitiativeLink />
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-3 divide-x divide-teal/10 rounded-xl border border-teal/15 bg-white shadow-panel">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 py-5 text-center sm:py-6">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-3xl text-teal sm:text-4xl">{stat.value.toLocaleString()}</dd>
              <dd className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">How would you like to help?</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2" role="radiogroup" aria-label="How you can help">
          {helpGroups.map((group) => (
            <button
              key={group.value}
              type="button"
              role="radio"
              aria-checked={help === group.value}
              onClick={() => setHelp(group.value)}
              className={`shrink-0 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                help === group.value
                  ? 'border-teal bg-teal text-cream shadow-card'
                  : 'border-teal/20 bg-white text-teal hover:border-teal/50 hover:bg-teal-light/50'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex flex-wrap gap-x-1 gap-y-2 text-sm" role="tablist" aria-label="Initiative types">
            {initiativeKinds.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={kind === item.value}
                onClick={() => setKind(item.value)}
                className={`rounded-pill px-3 py-1 font-semibold transition ${
                  kind === item.value ? 'bg-teal-light text-teal' : 'text-muted hover:text-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="inline-flex rounded-md border border-border bg-white p-0.5 text-sm font-semibold" role="group" aria-label="View">
            {(['list', 'map'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                onClick={() => setView(value)}
                className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 transition ${
                  view === value ? 'bg-teal text-cream' : 'text-muted hover:text-ink'
                }`}
              >
                {value === 'list' ? <List size={15} /> : <MapIcon size={15} />}
                {value === 'list' ? 'List' : 'Map'}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted">
          {listQuery.isLoading
            ? 'Loading…'
            : initiatives.length === 0
            ? 'No initiatives match these filters yet. Try another way to help.'
            : `${initiatives.length} initiative${initiatives.length === 1 ? '' : 's'}`}
        </p>

        <div className="mt-4">
          {view === 'list' ? (
            <div className="grid gap-6">
              {initiatives.map((initiative) => (
                <InitiativeRow key={initiative.slug} initiative={initiative} />
              ))}
            </div>
          ) : (
            <InitiativesMap initiatives={initiatives} />
          )}
        </div>
      </section>

      <section className="bg-teal-light/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <TwoToneHeading align="center" title="Start something" subtitle="and let the community find you" />
          <Ornament className="mx-auto mt-6" />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-lg border border-teal/15 bg-white p-6 shadow-card">
                <span className="grid h-10 w-10 place-items-center rounded-pill bg-teal font-display text-lg text-cream">{index + 1}</span>
                <p className="mt-4 font-display text-xl">{step.title}</p>
                <p className="mt-2 text-[15px] text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ClosingBand
        palette="teal"
        photo={sitePhotos.nandi}
        photoPosition="center 55%"
        photoOpacity="opacity-50"
        title="Like Nandi"
        subtitle="patient, present, ready to serve"
        text="Your initiative doesn't need to be big. A Sunday class, a few saplings, an evening with an elder. List it, and the people who want to help will find you."
        action={<ListInitiativeLink />}
      />
    </main>
  );
}
