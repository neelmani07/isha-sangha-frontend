import { useQuery } from '@tanstack/react-query';
import { PageLayout, Section } from '../../../components/layout/PageLayout';
import { Avatar } from '../../../components/ui/Avatar';
import { ProgramBadge } from '../../../components/ui/Badge';
import { LinkCard } from '../../../components/ui/Card';
import { CardSkeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { resourcesApi } from '../../../api/resources';

export function TeachersPage() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: resourcesApi.teachers,
  });

  return (
    <PageLayout
      title="Teachers"
      description="Discover Isha Hatha Yoga teachers by city and programs offered."
      breadcrumbs={[{ label: 'Globe', to: '/' }, { label: 'Teachers' }]}
    >
      <Section title="All teachers">
        <div className="grid gap-4 md:grid-cols-2">
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)}
          {isError && <EmptyState message="The backend is not reachable yet." />}
          {data?.content.map((teacher) => (
            <LinkCard key={teacher.id} to={`/teacher/${teacher.slug}`}>
              <div className="flex gap-4">
                <Avatar name={teacher.name} photoUrl={teacher.photoUrl} />
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-2xl font-semibold">{teacher.name}</h2>
                  <p className="mt-1 text-sm font-medium text-saffron-dark">{teacher.cityName}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {teacher.programs.slice(0, 3).map((program) => (
                      <ProgramBadge key={program.id} name={program.name} />
                    ))}
                  </div>
                </div>
              </div>
            </LinkCard>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
