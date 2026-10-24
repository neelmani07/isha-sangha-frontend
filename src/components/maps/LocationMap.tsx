import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { symbolIcon } from './mapSymbols';

type LocationMapProps = {
  lat: number;
  lng: number;
  label: string;
  height?: string;
  /** Entity type for the marker symbol, e.g. "TEACHER" or "DEVI_TEMPLE". */
  kind?: string;
};

export function LocationMap({ lat, lng, label, height = '280px', kind = 'CENTER' }: LocationMapProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-card">
      <div className="border-b border-ink/10 px-4 py-3">
        <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Location</p>
        <p className="font-display text-lg font-semibold">{label}</p>
      </div>
      <MapContainer center={[lat, lng]} zoom={13} style={{ height, width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus lat={lat} lng={lng} />
        <Marker position={[lat, lng]} icon={symbolIcon(kind)}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

function MapFocus({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}
