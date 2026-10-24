import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageLayout, Section } from '../../../components/layout/PageLayout';
import { Badge } from '../../../components/ui/Badge';
import { LinkCard } from '../../../components/ui/Card';
import { SearchField } from '../../../components/ui/Form';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { resourcesApi } from '../../../api/resources';
import { formatEntityType } from '../../../utils/labels';
import { nav, pages } from '../../../content/copy';

const typeVariants: Record<string, 'default' | 'leaf' | 'gold' | 'shop' | 'temple' | 'sky'> = {
  CITY: 'leaf',
  TEACHER: 'sky',
  CENTER: 'gold',
  COUNTRY: 'default',
  STATE: 'default',
};

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [draft, setDraft] = useState(query);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () => resourcesApi.search(query),
    enabled: Boolean(query),
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (draft.trim()) {
      setParams({ q: draft.trim() });
    }
  }

  return (
    <PageLayout
      title="Search"
      description={pages.search.description}
      breadcrumbs={[{ label: nav.explore, to: '/' }, { label: 'Search' }]}
    >
      <form onSubmit={submit}>
        <SearchField
          value={draft}
          onChange={setDraft}
          placeholder={pages.search.placeholder}
        />
      </form>

      <Section title={query ? `Results for “${query}”` : 'Start searching'}>
        {!query && (
          <EmptyState
            title={pages.search.emptyTitle}
            message={pages.search.emptyMessage}
          />
        )}
        <div className="grid gap-3">
          {isLoading && Array.from({ length: 4 }).map((_, index) => <CardSkeleton key={index} />)}
          {isError && <EmptyState message="Search isn’t available just now. Please try again in a moment." />}
          {query && !isLoading && data?.length === 0 && (
            <EmptyState message={pages.search.noResults} />
          )}
          {data?.map((result) => (
            <LinkCard key={`${result.type}-${result.id}`} to={resultHref(result)}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Badge variant={typeVariants[result.type] ?? 'default'}>{formatEntityType(result.type)}</Badge>
                  <h3 className="mt-2 font-display text-xl font-semibold">{result.name}</h3>
                </div>
                {result.lat != null && result.lng != null && (
                  <span className="text-xs text-ink/45">
                    {result.lat.toFixed(2)}, {result.lng.toFixed(2)}
                  </span>
                )}
              </div>
            </LinkCard>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}

function resultHref(result: { type: string; slug: string | null; name: string }) {
  if (result.slug && result.type === 'CITY') return `/city/${result.slug}`;
  if (result.slug && result.type === 'TEACHER') return `/teacher/${result.slug}`;
  if (result.slug && result.type === 'CENTER') return `/center/${result.slug}`;
  return `/search?q=${encodeURIComponent(result.name)}`;
}
