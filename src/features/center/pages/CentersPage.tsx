import { useQuery } from '@tanstack/react-query';
import { PageLayout, Section } from '../../../components/layout/PageLayout';
import { Badge } from '../../../components/ui/Badge';
import { LinkCard } from '../../../components/ui/Card';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { resourcesApi } from '../../../api/resources';
import { centerTypeBadge } from '../../../utils/labels';
import { nav, pages } from '../../../content/copy';

export function CentersPage() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['centers'],
    queryFn: () => resourcesApi.centers(),
  });

  return (
    <PageLayout
      title={pages.centres.title}
      description={pages.centres.description}
      breadcrumbs={[{ label: nav.explore, to: '/' }, { label: nav.centres }]}
    >
      <Section title="All centres, temples and shops">
        <div className="grid gap-4 md:grid-cols-2">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)}
          {isError && <EmptyState message="We couldn’t load the list just now. Please try again in a moment." />}
          {data?.content.map((center) => {
            const badge = centerTypeBadge(center.type);
            return (
              <LinkCard key={center.id} to={`/center/${center.slug}`}>
                <Badge variant={badge.variant}>{badge.label}</Badge>
                <h2 className="mt-3 font-display text-2xl font-semibold">{center.name}</h2>
                <p className="mt-1 text-sm font-medium text-saffron-dark">{center.cityName}</p>
                {center.address && <p className="mt-3 text-sm text-ink/60">{center.address}</p>}
              </LinkCard>
            );
          })}
        </div>
      </Section>
    </PageLayout>
  );
}
