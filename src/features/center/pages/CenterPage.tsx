import { useQuery } from '@tanstack/react-query';
import { Compass, Mail, MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '../../../components/layout/DetailPageLayout';
import { LocationMap } from '../../../components/maps/LocationMap';
import { LinkButton } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { PageHeaderSkeleton } from '../../../components/ui/Skeleton';
import { EmptyState } from '../../../components/ui/EmptyState';
import { resourcesApi } from '../../../api/resources';
import { centerTypeBadge } from '../../../utils/labels';

export function CenterPage() {
  const { slug = '' } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['center', slug],
    queryFn: () => resourcesApi.centerBySlug(slug),
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
        title="Center not found"
        description="The center may not exist yet or the backend is not running."
        breadcrumbs={[{ label: 'Globe', to: '/' }, { label: 'Centers', to: '/centers' }, { label: 'Not found' }]}
      >
        <EmptyState message="Try searching for another center or return to the globe." />
      </DetailPageLayout>
    );
  }

  const badge = centerTypeBadge(data.type);
  const hasCoords = data.latitude != null && data.longitude != null;

  return (
    <DetailPageLayout
      title={data.name}
      subtitle={data.cityName}
      description={data.description ?? undefined}
      badge={badge.label}
      badgeVariant={badge.variant}
      breadcrumbs={[
        { label: 'Globe', to: '/' },
        { label: 'Centers', to: '/centers' },
        { label: data.cityName, to: `/search?q=${encodeURIComponent(data.cityName)}` },
        { label: data.name },
      ]}
      actions={
        <>
          <LinkButton to="/nearby" variant="secondary" size="sm">
            <Navigation size={16} />
            Find nearby
          </LinkButton>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Contact & directions</h2>
            <div className="mt-4 grid gap-3">
              {data.address && (
                <ContactRow icon={<MapPin size={18} />} label="Address" value={data.address} />
              )}
              {data.phone && (
                <ContactRow icon={<Phone size={18} />} label="Phone" value={data.phone} href={`tel:${data.phone}`} />
              )}
              {data.email && (
                <ContactRow icon={<Mail size={18} />} label="Email" value={data.email} href={`mailto:${data.email}`} />
              )}
              {data.website && (
                <ContactRow icon={<ExternalLink size={18} />} label="Website" value={data.website} href={data.website} external />
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
                Explore {data.cityName}
              </LinkButton>
            </div>
          </Card>
        </div>

        {hasCoords ? (
          <LocationMap lat={data.latitude!} lng={data.longitude!} label={data.name} kind={data.type} />
        ) : (
          <Card className="flex h-[280px] items-center justify-center p-6 text-center text-sm text-ink/60">
            Map unavailable — location coordinates not set for this center.
          </Card>
        )}
      </div>
    </DetailPageLayout>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = href ? (
    <a
      href={href}
      className="font-medium text-saffron hover:underline"
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {value}
    </a>
  ) : (
    <span className="font-medium text-ink">{value}</span>
  );

  return (
    <div className="flex gap-3 text-sm">
      <span className="mt-0.5 text-saffron">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-ink/45">{label}</p>
        <div className="mt-1">{content}</div>
      </div>
    </div>
  );
}
