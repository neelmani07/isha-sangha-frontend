import L from 'leaflet';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Initiative } from '../../../types/api';
import { kindLabel } from '../labels';
import 'leaflet/dist/leaflet.css';

const pin = L.divIcon({
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: '<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#0b4a63;border:3px solid #e2efee;box-shadow:0 0 0 3px rgba(11,74,99,.25)"></span>',
});

export function InitiativesMap({ initiatives }: { initiatives: Initiative[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-teal/15 shadow-card">
      <MapContainer center={[20, 40]} zoom={2} scrollWheelZoom={false} className="h-[520px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToInitiatives initiatives={initiatives} />
        {located(initiatives).map((initiative) => (
          <Marker key={initiative.slug} position={[initiative.lat!, initiative.lng!]} icon={pin}>
            <Popup>
              <div className="min-w-[180px] text-ink">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal">{kindLabel[initiative.kind]}</p>
                <p className="mt-1 font-display text-base font-semibold">{initiative.title}</p>
                <p className="text-xs text-muted">{initiative.cityName}</p>
                <Link to={`/initiatives/${initiative.slug}`} className="mt-2 inline-block text-sm font-semibold text-teal">
                  See how to help
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function FitToInitiatives({ initiatives }: { initiatives: Initiative[] }) {
  const map = useMap();

  useEffect(() => {
    const points = located(initiatives);
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((item) => [item.lat!, item.lng!] as L.LatLngTuple));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 });
  }, [map, initiatives]);

  return null;
}

/** Initiatives in the same city share its centre point; spread them in a small circle so every pin is clickable. */
function located(initiatives: Initiative[]) {
  const seen = new Map<string, number>();
  return initiatives
    .filter((item) => item.lat != null && item.lng != null)
    .map((item) => {
      const key = `${item.lat!.toFixed(4)}:${item.lng!.toFixed(4)}`;
      const index = seen.get(key) ?? 0;
      seen.set(key, index + 1);
      if (index === 0) return item;
      const angle = (index * 2 * Math.PI) / 6;
      return { ...item, lat: item.lat! + Math.sin(angle) * 0.012, lng: item.lng! + Math.cos(angle) * 0.012 };
    });
}
