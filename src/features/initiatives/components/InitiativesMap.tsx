import L from 'leaflet';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { kindLabel, type Initiative } from '../data/sampleInitiatives';
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
        {initiatives.map((initiative) => (
          <Marker key={initiative.slug} position={[initiative.coords.lat, initiative.coords.lng]} icon={pin}>
            <Popup>
              <div className="min-w-[180px] text-ink">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal">{kindLabel[initiative.kind]}</p>
                <p className="mt-1 font-display text-base font-semibold">{initiative.title}</p>
                <p className="text-xs text-muted">{initiative.place.name}</p>
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
    if (initiatives.length === 0) return;
    const bounds = L.latLngBounds(initiatives.map((item) => [item.coords.lat, item.coords.lng] as L.LatLngTuple));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 11 });
  }, [map, initiatives]);

  return null;
}
