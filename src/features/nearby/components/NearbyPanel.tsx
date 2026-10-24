import { useQuery } from '@tanstack/react-query';
import L from 'leaflet';
import { LocateFixed, MapPin, Navigation } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { resourcesApi } from '../../../api/resources';
import { useGeolocation } from '../../../hooks/useGeolocation';
import type { NearbyResult } from '../../../types/api';
import { formatDistance } from '../../../utils/geo';
import { MapLegend, symbolIcon } from '../../../components/maps/mapSymbols';
import 'leaflet/dist/leaflet.css';
import { labelFor } from '../../../content/copy';

const radiusOptions = [25, 50, 100, 250];

const typeFilters: Array<{ label: string; value: string }> = [
  { label: 'All', value: '' },
  { label: 'Teachers', value: 'TEACHER' },
  { label: 'Centres', value: 'CENTER' },
  { label: 'Shops', value: 'ISHA_SHOP' },
  { label: 'Temples', value: 'DEVI_TEMPLE' },
  { label: 'Cities', value: 'CITY' },
  { label: 'Meditators', value: 'MEDITATOR' },
];

export function NearbyPanel() {
  const { coords, error, loading, requestLocation } = useGeolocation();
  const [radiusKm, setRadiusKm] = useState(100);
  const [typeFilter, setTypeFilter] = useState('');

  // Locate automatically only when the visitor already granted permission; otherwise wait for a click
  // so the Explore page never opens with a location prompt.
  useEffect(() => {
    navigator.permissions
      ?.query({ name: 'geolocation' })
      .then((status) => {
        if (status.state === 'granted') requestLocation();
      })
      .catch(() => undefined);
  }, [requestLocation]);

  const nearbyQuery = useQuery({
    queryKey: ['nearby', coords?.lat, coords?.lng, radiusKm, typeFilter],
    queryFn: () =>
      resourcesApi.nearby({
        lat: coords!.lat,
        lng: coords!.lng,
        radiusKm,
        types: typeFilter || undefined,
        limit: 50,
      }),
    enabled: Boolean(coords),
  });

  const results = nearbyQuery.data ?? [];

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section className="space-y-5">
          <div className="rounded-lg border border-border bg-white p-5 shadow-panel">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-saffron">Your location</p>
                <p className="mt-2 text-sm text-muted">
                  {coords ? 'Showing places around you.' : 'Share your location to see what is close to you.'}
                </p>
              </div>
              <button
                type="button"
                onClick={requestLocation}
                className="inline-flex items-center gap-2 rounded-md border border-saffron bg-saffron px-4 py-3 text-sm font-semibold text-white hover:bg-saffron-dark"
              >
                <LocateFixed size={16} />
                {loading ? 'Locating...' : coords ? 'Refresh location' : 'Use my location'}
              </button>
            </div>

            {error && <p className="mt-4 text-sm text-ember">{error}</p>}
            {coords && (
              <p className="mt-4 text-xs text-muted">
                Using {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-border bg-white p-4 shadow-card">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">Search radius</p>
            <div className="flex flex-wrap gap-2">
              {radiusOptions.map((radius) => (
                <button
                  key={radius}
                  type="button"
                  onClick={() => setRadiusKm(radius)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    radiusKm === radius
                      ? 'border-saffron bg-saffron-light text-saffron-dark ring-1 ring-saffron/20'
                      : 'border-border bg-white text-ink hover:border-saffron/40 hover:bg-sand/50'
                  }`}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 shadow-card">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted">Show</p>
            <div className="flex flex-wrap gap-2">
              {typeFilters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setTypeFilter(filter.value)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                    typeFilter === filter.value
                      ? 'border-saffron bg-saffron-light text-saffron-dark ring-1 ring-saffron/20'
                      : 'border-border bg-white text-ink hover:border-saffron/40 hover:bg-sand/50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {!coords && !loading && (
              <EmptyCard message="Tap “Use my location” to find teachers, centres and temples near you." />
            )}
            {nearbyQuery.isLoading && coords && <EmptyCard message="Searching nearby locations..." />}
            {nearbyQuery.isError && <EmptyCard message="Could not load nearby results. Is the backend running?" />}
            {coords && !nearbyQuery.isLoading && results.length === 0 && (
              <EmptyCard message={`No locations found within ${radiusKm} km. Try increasing the radius.`} />
            )}

            {results.map((result) => (
              <NearbyResultCard key={`${result.type}-${result.id}`} result={result} />
            ))}
          </div>
        </section>

        <section className="min-h-[360px] lg:sticky lg:top-24 lg:self-start">
          {coords ? (
            <NearbyMap userLat={coords.lat} userLng={coords.lng} results={results} />
          ) : (
            <div className="flex h-[360px] items-center justify-center rounded-lg border border-border bg-white p-6 text-center text-sm text-muted shadow-card">
              Map appears once your location is available.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function NearbyResultCard({ result }: { result: NearbyResult }) {
  return (
    <Link
      to={nearbyHref(result)}
      className="block rounded-lg border border-border bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-saffron/30 hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-saffron">{formatNearbyType(result.type)}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{result.name}</h3>
          {result.subtitle && <p className="mt-1 text-sm text-muted">{result.subtitle}</p>}
        </div>
        <span className="shrink-0 rounded-pill border border-saffron/25 bg-saffron-light px-2 py-1 text-xs font-semibold text-saffron-dark">
          {formatDistance(result.distanceKm)}
        </span>
      </div>
    </Link>
  );
}

function NearbyMap({
  userLat,
  userLng,
  results,
}: {
  userLat: number;
  userLng: number;
  results: NearbyResult[];
}) {
  const markers = useMemo(
    () => results.filter((result) => result.lat && result.lng),
    [results],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white shadow-panel">
      <div className="border-b border-border px-4 py-3">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Map view</p>
        <p className="font-display text-xl font-semibold text-ink">{markers.length} nearby</p>
        <MapLegend kinds={['TEACHER', 'CITY_CENTER', 'MAJOR_CENTER', 'DEVI_TEMPLE', 'ISHA_SHOP', 'MEDITATOR']} className="mt-2" />
      </div>
      <MapContainer center={[userLat, userLng]} zoom={10} className="h-[420px] w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus userLat={userLat} userLng={userLng} markers={markers} />
        <Marker position={[userLat, userLng]} icon={symbolIcon('YOU')}>
          <Popup>You are here</Popup>
        </Marker>
        {markers.map((result) => (
          <Marker
            key={`${result.type}-${result.id}`}
            position={[result.lat, result.lng]}
            icon={symbolIcon(result.type)}
          >
            <Popup>
              <div className="text-ink">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted">{formatNearbyType(result.type)}</p>
                <p className="font-semibold">{result.name}</p>
                <a className="mt-2 inline-block text-sm font-semibold text-saffron" href={nearbyHref(result)}>
                  Open
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function MapFocus({
  userLat,
  userLng,
  markers,
}: {
  userLat: number;
  userLng: number;
  markers: NearbyResult[];
}) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [
      [userLat, userLng],
      ...markers.map((marker) => [marker.lat, marker.lng] as L.LatLngTuple),
    ];
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 12 });
    }
  }, [map, markers, userLat, userLng]);

  return null;
}

function formatNearbyType(type: string) {
  return labelFor(type);
}

function nearbyHref(result: NearbyResult) {
  if (result.type === 'CITY' && result.slug) {
    return `/city/${result.slug}`;
  }

  if (result.type === 'TEACHER' && result.slug) {
    return `/teacher/${result.slug}`;
  }

  if (result.slug && result.type !== 'CITY' && result.type !== 'TEACHER') {
    return `/center/${result.slug}`;
  }

  if (result.citySlug) {
    return `/city/${result.citySlug}`;
  }

  return '/';
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-6 text-sm text-muted shadow-card">
      {message}
    </div>
  );
}

export function NearbyIcon() {
  return <Navigation size={16} />;
}

export function NearbyPinIcon() {
  return <MapPin size={16} />;
}
