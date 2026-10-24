import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, LocateFixed } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DetailPageLayout } from '../../../components/layout/DetailPageLayout';
import { Section } from '../../../components/layout/PageLayout';
import { Avatar } from '../../../components/ui/Avatar';
import { DistanceBadge, ProgramBadge } from '../../../components/ui/Badge';
import { LinkCard, StatCard } from '../../../components/ui/Card';
import { FilterChip } from '../../../components/ui/FilterChip';
import { SearchField, Select } from '../../../components/ui/Form';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { PageHeaderSkeleton } from '../../../components/ui/Skeleton';
import { resourcesApi } from '../../../api/resources';
import type { CenterType, Teacher } from '../../../types/api';
import { formatDistance, haversineKm } from '../../../utils/geo';
import { centerTypeBadge } from '../../../utils/labels';
import { CityMap } from '../components/CityMap';
import { useGeolocation } from '../../../hooks/useGeolocation';

const centerTypes: Array<{ label: string; value: CenterType | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Centers', value: 'CITY_CENTER' },
  { label: 'Major', value: 'MAJOR_CENTER' },
  { label: 'Temples', value: 'DEVI_TEMPLE' },
  { label: 'Shops', value: 'ISHA_SHOP' },
];

const PAGE_SIZE = 20;

export function CityPage() {
  const { slug = '' } = useParams();
  const [teacherPage, setTeacherPage] = useState(0);
  const [centerPage, setCenterPage] = useState(0);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [centerSearch, setCenterSearch] = useState('');
  const [programId, setProgramId] = useState<number | undefined>();
  const [centerType, setCenterType] = useState<CenterType | 'ALL'>('ALL');
  const [nearMe, setNearMe] = useState(false);
  const [highlighted, setHighlighted] = useState<{ type: 'teacher' | 'center'; id: number } | null>(null);

  const deferredTeacherSearch = useDeferredValue(teacherSearch.trim());
  const deferredCenterSearch = useDeferredValue(centerSearch.trim());
  const { coords, error: geoError, loading: geoLoading, requestLocation } = useGeolocation();

  const cityQuery = useQuery({
    queryKey: ['city', slug],
    queryFn: () => resourcesApi.cityBySlug(slug),
    enabled: Boolean(slug),
  });

  const programsQuery = useQuery({
    queryKey: ['programs'],
    queryFn: () => resourcesApi.programs(),
  });

  const cityId = cityQuery.data?.id;

  const teachersQuery = useQuery({
    queryKey: ['city-teachers', cityId, teacherPage, deferredTeacherSearch, programId, nearMe, coords?.lat, coords?.lng],
    queryFn: () =>
      resourcesApi.cityTeachers(cityId!, {
        page: teacherPage,
        size: PAGE_SIZE,
        q: deferredTeacherSearch || undefined,
        programId,
        nearMe,
        lat: coords?.lat,
        lng: coords?.lng,
      }),
    enabled: Boolean(cityId),
  });

  const centersQuery = useQuery({
    queryKey: ['city-centers', cityId, centerPage, deferredCenterSearch, centerType],
    queryFn: () =>
      resourcesApi.cityCenters(cityId!, {
        page: centerPage,
        size: PAGE_SIZE,
        q: deferredCenterSearch || undefined,
        type: centerType === 'ALL' ? undefined : centerType,
      }),
    enabled: Boolean(cityId),
  });

  const mapTeachersQuery = useQuery({
    queryKey: ['city-map-teachers', cityId],
    queryFn: () => resourcesApi.cityTeachers(cityId!, { page: 0, size: 500 }),
    enabled: Boolean(cityId),
  });

  const mapMeditatorsQuery = useQuery({
    queryKey: ['city-map-meditators', cityId],
    queryFn: () => resourcesApi.meditators(cityId!),
    enabled: Boolean(cityId),
  });

  const mapCentersQuery = useQuery({
    queryKey: ['city-map-centers', cityId],
    queryFn: () => resourcesApi.cityCenters(cityId!, { page: 0, size: 500 }),
    enabled: Boolean(cityId),
  });

  function toggleNearMe() {
    if (!nearMe && !coords) {
      requestLocation();
    }
    setNearMe((current) => !current);
    setTeacherPage(0);
  }

  if (cityQuery.isLoading) {
    return (
      <main className="min-h-screen bg-cream p-8">
        <PageHeaderSkeleton />
      </main>
    );
  }

  if (cityQuery.isError || !cityQuery.data) {
    return (
      <DetailPageLayout
        title="City not found"
        description="The city may not exist yet or the backend is not running."
        breadcrumbs={[{ label: 'Globe', to: '/' }, { label: 'Not found' }]}
      >
        <EmptyState message="Try searching for another city or return to the globe." />
      </DetailPageLayout>
    );
  }

  const city = cityQuery.data;
  const cityLat = city.latitude ?? 20;
  const cityLng = city.longitude ?? 0;

  return (
    <DetailPageLayout
      title={city.name}
      subtitle={`${city.stateName}, ${city.countryName}`}
      description={city.description ?? undefined}
      badge="City"
      badgeVariant="saffron"
      heroImageUrl={city.heroImageUrl}
      breadcrumbs={[
        { label: 'Globe', to: '/' },
        { label: city.countryName, to: `/search?q=${encodeURIComponent(city.countryName)}` },
        { label: city.name },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Meditators" value={city.stats.meditatorCount} />
        <StatCard label="Teachers" value={city.stats.teacherCount} />
        <StatCard label="Centers" value={city.stats.centerCount} />
        <StatCard label="Shops" value={city.stats.shopCount} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-8">
          <Section title="Hatha Yoga Teachers">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <SearchField
                value={teacherSearch}
                onChange={(value) => {
                  setTeacherSearch(value);
                  setTeacherPage(0);
                }}
                placeholder="Search teachers by name"
              />
              <Select
                value={programId ?? ''}
                onChange={(event) => {
                  setProgramId(event.target.value ? Number(event.target.value) : undefined);
                  setTeacherPage(0);
                }}
                className="min-w-[180px]"
              >
                <option value="">All programs</option>
                {programsQuery.data?.content.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </Select>
              <Button type="button" variant={nearMe ? 'primary' : 'secondary'} size="sm" onClick={toggleNearMe}>
                <LocateFixed size={16} />
                {geoLoading ? 'Locating...' : 'Near me'}
              </Button>
            </div>

            {geoError && nearMe && <p className="text-sm text-ember">{geoError}</p>}
            {nearMe && coords && (
              <p className="text-sm text-ink/60">Sorting teachers by distance from your current location.</p>
            )}

            <ResultMeta
              total={teachersQuery.data?.totalElements ?? 0}
              page={teacherPage}
              totalPages={teachersQuery.data?.totalPages ?? 0}
              loading={teachersQuery.isLoading}
              label="teachers"
            />

            <div className="grid gap-3">
              {teachersQuery.data?.content.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  userCoords={coords}
                  onHighlight={() => setHighlighted({ type: 'teacher', id: teacher.id })}
                />
              ))}
              {!teachersQuery.isLoading && teachersQuery.data?.content.length === 0 && (
                <EmptyState message="No teachers match your filters in this city." />
              )}
            </div>

            <Pagination page={teacherPage} totalPages={teachersQuery.data?.totalPages ?? 0} onChange={setTeacherPage} />
          </Section>

          <Section title="Centers & Shops">
            <SearchField
              value={centerSearch}
              onChange={(value) => {
                setCenterSearch(value);
                setCenterPage(0);
              }}
              placeholder="Search centers and shops"
            />

            <div className="flex flex-wrap gap-2">
              {centerTypes.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  active={centerType === option.value}
                  onClick={() => {
                    setCenterType(option.value);
                    setCenterPage(0);
                  }}
                />
              ))}
            </div>

            <ResultMeta
              total={centersQuery.data?.totalElements ?? 0}
              page={centerPage}
              totalPages={centersQuery.data?.totalPages ?? 0}
              loading={centersQuery.isLoading}
              label="locations"
            />

            <div className="grid gap-3">
              {centersQuery.data?.content.map((center) => {
                const badge = centerTypeBadge(center.type);
                return (
                  <LinkCard
                    key={center.id}
                    to={`/center/${center.slug}`}
                    onMouseEnter={() => setHighlighted({ type: 'center', id: center.id })}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <ProgramBadge name={badge.label} />
                        <h3 className="mt-2 font-display text-xl font-semibold">{center.name}</h3>
                        {center.address && <p className="mt-2 text-sm text-ink/50">{center.address}</p>}
                      </div>
                      {coords && center.latitude != null && center.longitude != null && (
                        <DistanceBadge
                          distance={formatDistance(
                            haversineKm(coords.lat, coords.lng, center.latitude, center.longitude),
                          )}
                        />
                      )}
                    </div>
                  </LinkCard>
                );
              })}
              {!centersQuery.isLoading && centersQuery.data?.content.length === 0 && (
                <EmptyState message="No centers or shops match your filters in this city." />
              )}
            </div>

            <Pagination page={centerPage} totalPages={centersQuery.data?.totalPages ?? 0} onChange={setCenterPage} />
          </Section>
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <CityMap
            cityName={city.name}
            cityLat={cityLat}
            cityLng={cityLng}
            centers={mapCentersQuery.data?.content ?? []}
            teachers={mapTeachersQuery.data?.content ?? []}
            meditators={mapMeditatorsQuery.data?.content ?? []}
            userLocation={coords}
            highlightedId={highlighted}
          />
          <p className="mt-3 text-sm text-ink/60">
            Hover a teacher or center card to focus it on the map.
          </p>
        </div>
      </div>
    </DetailPageLayout>
  );
}

function TeacherCard({
  teacher,
  userCoords,
  onHighlight,
}: {
  teacher: Teacher;
  userCoords: { lat: number; lng: number } | null;
  onHighlight: () => void;
}) {
  return (
    <LinkCard to={`/teacher/${teacher.slug}`} onMouseEnter={onHighlight} className="!p-4">
      <div className="flex items-start gap-4">
        <Avatar name={teacher.name} photoUrl={teacher.photoUrl} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-xl font-semibold">{teacher.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {teacher.programs.slice(0, 2).map((program) => (
                  <ProgramBadge key={program.id} name={program.name} />
                ))}
              </div>
              {teacher.bio && <p className="mt-2 line-clamp-2 text-sm text-ink/50">{teacher.bio}</p>}
            </div>
            {userCoords && teacher.latitude != null && teacher.longitude != null && (
              <DistanceBadge
                distance={formatDistance(haversineKm(userCoords.lat, userCoords.lng, teacher.latitude, teacher.longitude))}
              />
            )}
          </div>
        </div>
      </div>
    </LinkCard>
  );
}

function ResultMeta({
  total,
  page,
  totalPages,
  loading,
  label,
}: {
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  label: string;
}) {
  return (
    <p className="text-sm text-ink/60">
      {loading
        ? `Loading ${label}...`
        : `${total.toLocaleString()} ${label}${totalPages > 1 ? ` · page ${page + 1} of ${totalPages}` : ''}`}
    </p>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="secondary" size="sm" disabled={page === 0} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} />
        Previous
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={page + 1 >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
