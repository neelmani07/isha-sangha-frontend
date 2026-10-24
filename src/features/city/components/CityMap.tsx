import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { MapLegend, symbolIcon } from '../../../components/maps/mapSymbols';
import type { Center, CenterType, Meditator, Teacher } from '../../../types/api';
import 'leaflet/dist/leaflet.css';

type CityMapProps = {
  cityName: string;
  cityLat: number;
  cityLng: number;
  centers: Center[];
  teachers: Teacher[];
  /** Approximate, city-level points of members who chose to be visible. */
  meditators?: Meditator[];
  userLocation?: { lat: number; lng: number } | null;
  highlightedId?: { type: 'teacher' | 'center'; id: number } | null;
};


export function CityMap({
  cityName,
  cityLat,
  cityLng,
  centers,
  teachers,
  meditators = [],
  userLocation,
  highlightedId,
}: CityMapProps) {
  const markers = useMemo(() => {
    const centerMarkers = centers
      .filter((center) => center.latitude != null && center.longitude != null)
      .map((center) => ({
        id: center.id,
        type: 'center' as const,
        centerType: center.type,
        name: center.name,
        lat: center.latitude!,
        lng: center.longitude!,
        href: `/center/${center.slug}`,
        subtitle: center.type.replace(/_/g, ' '),
      }));

    const teacherMarkers = teachers
      .filter((teacher) => teacher.latitude != null && teacher.longitude != null)
      .map((teacher) => ({
        id: teacher.id,
        type: 'teacher' as const,
        name: teacher.name,
        lat: teacher.latitude!,
        lng: teacher.longitude!,
        href: `/teacher/${teacher.slug}`,
        subtitle: teacher.programs.map((program) => program.name).join(', '),
      }));

    return [...centerMarkers, ...teacherMarkers];
  }, [centers, teachers]);

  return (
    <div className="overflow-hidden border border-ink/10 bg-white shadow-panel">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Local map</p>
          <h2 className="font-display text-xl font-semibold">{cityName}</h2>
        </div>
        <MapLegend kinds={['TEACHER', 'CITY_CENTER', 'MAJOR_CENTER', 'DEVI_TEMPLE', 'ISHA_SHOP', 'MEDITATOR']} className="max-w-md justify-end" />
      </div>

      <MapContainer center={[cityLat, cityLng]} zoom={12} className="h-[420px] w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus
          cityLat={cityLat}
          cityLng={cityLng}
          markers={markers}
          userLocation={userLocation}
          highlightedId={highlightedId}
        />

        {markers.map((marker) => (
          <Marker
            key={`${marker.type}-${marker.id}`}
            position={[marker.lat, marker.lng]}
            icon={symbolIcon(
              marker.type === 'teacher' ? 'TEACHER' : (marker as { centerType: CenterType }).centerType,
              highlightedId?.type === marker.type && highlightedId.id === marker.id,
            )}
          >
            <Popup>
              <div className="min-w-[180px] text-ink">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50">
                  {marker.type === 'teacher' ? 'Teacher' : 'Centre'}
                </p>
                <p className="font-semibold">{marker.name}</p>
                <p className="mt-1 text-xs text-ink/60">{marker.subtitle}</p>
                <a className="mt-2 inline-block text-sm font-semibold text-saffron" href={marker.href}>
                  View details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {meditators.map((meditator) => (
          <Marker key={`meditator-${meditator.id}`} position={[meditator.lat, meditator.lng]} icon={symbolIcon('MEDITATOR')}>
            <Popup>
              <div className="min-w-[160px] text-ink">
                <p className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Meditator</p>
                <p className="font-semibold">{meditator.displayName}</p>
                {meditator.practices.length > 0 && <p className="mt-1 text-xs text-ink/60">{meditator.practices.join(', ')}</p>}
                <p className="mt-1 text-[11px] text-ink/50">Shown at an approximate spot in {meditator.cityName}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={symbolIcon('YOU')}>
            <Popup>
              <p className="font-semibold text-ink">You are here</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

function MapFocus({
  cityLat,
  cityLng,
  markers,
  userLocation,
  highlightedId,
}: {
  cityLat: number;
  cityLng: number;
  markers: Array<{ id: number; type: 'teacher' | 'center'; lat: number; lng: number }>;
  userLocation?: { lat: number; lng: number } | null;
  highlightedId?: { type: 'teacher' | 'center'; id: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = [[cityLat, cityLng], ...markers.map((marker) => [marker.lat, marker.lng] as L.LatLngExpression)];

    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }

    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 14 });
    }
  }, [cityLat, cityLng, map, markers, userLocation]);

  useEffect(() => {
    if (!highlightedId) {
      return;
    }

    const marker = markers.find((item) => item.id === highlightedId.id && item.type === highlightedId.type);
    if (marker) {
      map.flyTo([marker.lat, marker.lng], 14, { duration: 0.8 });
    }
  }, [highlightedId, map, markers]);

  return null;
}
