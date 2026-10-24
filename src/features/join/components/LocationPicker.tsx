import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { symbolIcon } from '../../../components/maps/mapSymbols';
import 'leaflet/dist/leaflet.css';

type Point = { lat: number; lng: number };

/** Small map: click to drop the exact pin. Starts at the chosen city. */
export function LocationPicker({
  center,
  value,
  onChange,
  kind,
}: {
  center: Point;
  value: Point | null;
  onChange: (point: Point) => void;
  kind: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom={false} className="h-[280px] w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter center={center} />
        <ClickToPlace onChange={onChange} />
        {value && <Marker position={[value.lat, value.lng]} icon={symbolIcon(kind)} />}
      </MapContainer>
      <p className="border-t border-border bg-sand/50 px-3 py-2 text-xs text-muted">
        {value ? `Pinned at ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}. Click again to move it.` : 'Click the map to place the pin.'}
      </p>
    </div>
  );
}

function Recenter({ center }: { center: Point }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 12);
  }, [center.lat, center.lng, map]);
  return null;
}

function ClickToPlace({ onChange }: { onChange: (point: Point) => void }) {
  useMapEvents({
    click(event) {
      onChange({ lat: Number(event.latlng.lat.toFixed(6)), lng: Number(event.latlng.lng.toFixed(6)) });
    },
  });
  return null;
}
