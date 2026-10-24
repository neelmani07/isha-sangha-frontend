import { useQuery } from '@tanstack/react-query';
import { Compass, Mail, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '../../../components/layout/DetailPageLayout';
import { LocationMap } from '../../../components/maps/LocationMap';
import { LinkButton } from '../../../components/ui/Badge';
import { ProgramBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PageHeaderSkeleton } from '../../../components/ui/Skeleton';
import { resourcesApi } from '../../../api/resources';

export function TeacherPage() {
  const { slug = '' } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['teacher', slug],
    queryFn: () => resourcesApi.teacherBySlug(slug),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cream p-8">
        <PageHeaderSkeleton />
      </main>
    );
  }

  if (isError || !data) {
    return (
      <DetailPageLayout
        title="Teacher not found"
        description="The teacher may not exist yet or the backend is not running."
        breadcrumbs={[{ label: 'Globe', to: '/' }, { label: 'Teachers', to: '/teachers' }, { label: 'Not found' }]}
      >
        <EmptyState message="Try searching for another teacher or return to the globe." />
      </DetailPageLayout>
    );
  }

  const hasCoords = data.latitude != null && data.longitude != null;

  return (
    <DetailPageLayout
      title={data.name}
      subtitle={`Isha Hatha Yoga Teacher · ${data.cityName}`}
      description={data.bio ?? undefined}
      badge={data.verified ? 'Verified teacher' : 'Teacher'}
      badgeVariant={data.verified ? 'leaf' : 'sky'}
      heroImageUrl={data.photoUrl}
      breadcrumbs={[
        { label: 'Globe', to: '/' },
        { label: 'Teachers', to: '/teachers' },
        { label: data.cityName, to: `/search?q=${encodeURIComponent(data.cityName)}` },
        { label: data.name },
      ]}
      actions={
        <LinkButton to="/nearby" variant="secondary" size="sm">
          <Navigation size={16} />
          Find nearby
        </LinkButton>
      }
    >
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={data.name} photoUrl={data.photoUrl} size="lg" />
        <div className="flex flex-wrap gap-2">
          {data.programs.map((program) => (
            <ProgramBadge key={program.id} name={program.name} />
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <Card className="p-5">
          <h2 className="font-display text-xl font-semibold">Contact</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {data.email && (
              <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 font-medium text-saffron hover:underline">
                <Mail size={16} />
                {data.email}
              </a>
            )}
            {data.website && (
              <a
                href={data.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 font-medium text-saffron hover:underline"
              >
                <ExternalLink size={16} />
                {data.website}
              </a>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {hasCoords && (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`,
                    '_blank',
                  )
                }
              >
                <Compass size={16} />
                Get directions
              </Button>
            )}
            <LinkButton to={`/search?q=${encodeURIComponent(data.cityName)}`} variant="secondary" size="sm">
              <MapPin size={16} />
              More in {data.cityName}
            </LinkButton>
          </div>
        </Card>

        {hasCoords ? (
          <LocationMap lat={data.latitude!} lng={data.longitude!} label={data.name} kind="TEACHER" />
        ) : (
          <Card className="flex h-[280px] items-center justify-center p-6 text-center text-sm text-ink/60">
            Map unavailable — location coordinates not set for this teacher.
          </Card>
        )}
      </div>
    </DetailPageLayout>
  );
}
