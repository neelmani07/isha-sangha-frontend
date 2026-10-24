import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ornament } from '../../../components/brand/Ornament';
import { BackdropPhoto } from '../../../components/ui/BackdropPhoto';
import { SearchField } from '../../../components/ui/Form';
import { TwoToneHeading } from '../../../components/ui/TwoToneHeading';
import { sitePhotos } from '../../../content/sitePhotos';
import type { ResourceCategory } from '../../../types/api';
import { categoryOptions, resourceLibraryApi } from '../api/resourcesLibraryApi';
import { ResourceCard } from '../components/ResourceCard';

type Sort = 'helpful' | 'new';

export function ResourcesPage() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['resources'], queryFn: resourceLibraryApi.list });
  const [category, setCategory] = useState<ResourceCategory | 'ALL'>('ALL');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('helpful');

  const links = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = (data ?? []).filter(
      (link) =>
        (category === 'ALL' || link.category === category) &&
        (!needle || link.title.toLowerCase().includes(needle) || link.description?.toLowerCase().includes(needle)),
    );
    return [...filtered].sort((a, b) => (sort === 'helpful' ? b.helpful - a.helpful : b.sharedAt.localeCompare(a.sharedAt)));
  }, [data, category, query, sort]);

  return (
    <main className="font-body text-ink">
      <section className="relative isolate overflow-hidden bg-ink pt-[var(--header-h)] text-cream">
        <BackdropPhoto photo={sitePhotos.spandaHall} variant="fade-right" position="center 45%" className="-z-10 opacity-40 mix-blend-luminosity" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <div className="max-w-xl">
            <TwoToneHeading as="h1" size="lg" tone="light" title="Resources" subtitle="links worth sharing, gathered by the sangha" />
            <Ornament tone="light" className="mt-6 opacity-70" />
            <p className="mt-6 text-lg leading-relaxed text-cream/75">
              Programmes, seva, apps, reading and groups that meditators have found useful. Every link is checked by a volunteer
              before it appears here.
            </p>
            <Link
              to="/resources/suggest"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-cream shadow-card transition hover:bg-saffron-dark"
            >
              <Plus size={16} /> Suggest a link
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <SearchField value={query} onChange={setQuery} placeholder="Search the library…" />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Categories">
            {categoryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={category === option.value}
                onClick={() => setCategory(option.value)}
                className={`rounded-pill border px-3.5 py-1.5 text-sm font-semibold transition ${
                  category === option.value ? 'border-ink bg-ink text-cream' : 'border-border bg-white text-muted hover:border-ink/30 hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-md border border-border bg-white px-2 py-1.5 text-sm text-ink"
            >
              <option value="helpful">Most helpful</option>
              <option value="new">Newest</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-4">
          {isLoading && <p className="text-muted">Loading…</p>}
          {isError && <p className="text-muted">The library couldn’t load just now. Please try again in a moment.</p>}
          {!isLoading && !isError && links.length === 0 && <p className="text-muted">Nothing here yet. Be the first to suggest a link.</p>}
          {links.map((link) => (
            <ResourceCard key={link.id} link={link} />
          ))}
        </div>
      </section>
    </main>
  );
}
