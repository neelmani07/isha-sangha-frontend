import { Globe2, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiPost } from '../../../api/apiClient';
import { resourcesApi } from '../../../api/resources';
import { Input } from '../../../components/ui/Form';

export type PickedCity = { id: number; name: string; lat: number | null; lng: number | null; pending?: boolean };

type WorldPlace = { key: string; name: string; state: string | null; country: string; countryCode: string; lat: number; lng: number };

type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  addresstype?: string;
  address?: Record<string, string | undefined>;
};

const SETTLEMENTS = new Set(['city', 'town', 'village', 'municipality', 'hamlet', 'suburb']);

/** Worldwide place lookup on OpenStreetMap (Nominatim). Called only when the member asks for it. */
async function searchWorld(query: string): Promise<WorldPlace[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=8&accept-language=en&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Map search is unavailable right now.');
  const results = (await response.json()) as NominatimResult[];
  return results
    .filter((r) => r.address?.country_code && (!r.addresstype || SETTLEMENTS.has(r.addresstype)))
    .map((r) => {
      const a = r.address ?? {};
      return {
        key: String(r.place_id),
        name: a.city ?? a.town ?? a.village ?? a.municipality ?? a.hamlet ?? r.name ?? query,
        state: a.state ?? a.state_district ?? a.county ?? null,
        country: a.country ?? '',
        countryCode: (a.country_code ?? '').toUpperCase(),
        lat: Number(r.lat),
        lng: Number(r.lon),
      };
    });
}

/**
 * Type-ahead city search. Cities already on the map come first; if theirs is missing, members can search
 * the whole world map and add it (it appears publicly once a volunteer confirms it).
 */
export function CityPicker({ value, onChange }: { value: PickedCity | null; onChange: (city: PickedCity | null) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PickedCity[]>([]);
  const [open, setOpen] = useState(false);
  const [world, setWorld] = useState<WorldPlace[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setWorld(null);
    setError(null);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = window.setTimeout(() => {
      resourcesApi
        .search(query.trim())
        .then((found) =>
          setResults(
            found
              .filter((item) => item.type === 'CITY')
              .map((item) => ({ id: item.id, name: item.name, lat: item.lat, lng: item.lng })),
          ),
        )
        .catch(() => setResults([]));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  async function lookUpWorld() {
    setBusy(true);
    setError(null);
    try {
      setWorld(await searchWorld(query.trim()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Map search failed.');
    } finally {
      setBusy(false);
    }
  }

  async function addPlace(place: WorldPlace) {
    setBusy(true);
    setError(null);
    try {
      const city = await apiPost<{ id: number; name: string; lat: number; lng: number; status: string }>('/me/cities', {
        name: place.name,
        stateName: place.state,
        countryName: place.country,
        countryCode: place.countryCode,
        latitude: place.lat,
        longitude: place.lng,
      });
      onChange({ id: city.id, name: city.name, lat: city.lat, lng: city.lng, pending: city.status === 'PENDING' });
      setQuery('');
      setOpen(false);
      setWorld(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add this city.');
    } finally {
      setBusy(false);
    }
  }

  if (value) {
    return (
      <div>
        <div className="flex items-center justify-between rounded-md border border-border bg-white px-4 py-3">
          <span className="inline-flex items-center gap-2 font-semibold text-ink">
            <MapPin size={16} className="text-saffron" /> {value.name}
          </span>
          <button type="button" onClick={() => onChange(null)} className="text-muted hover:text-ink" aria-label="Change city">
            <X size={18} />
          </button>
        </div>
        {value.pending && (
          <p className="mt-1.5 text-xs text-muted">New to the map: it will appear publicly once a volunteer confirms it.</p>
        )}
      </div>
    );
  }

  const showMenu = open && query.trim().length >= 2;

  return (
    <div className="relative">
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Start typing your city…"
        aria-autocomplete="list"
      />
      {showMenu && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-white shadow-panel">
          {results.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => {
                onChange(city);
                setQuery('');
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-sand"
            >
              <MapPin size={14} className="text-gold" /> {city.name}
            </button>
          ))}

          {world === null ? (
            <button
              type="button"
              onClick={lookUpWorld}
              disabled={busy}
              className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm font-semibold text-teal hover:bg-teal-light/50"
            >
              <Globe2 size={15} />
              {busy ? 'Searching the world map…' : results.length ? 'Not here? Search the world map' : 'Not on our map yet. Search the world map'}
            </button>
          ) : world.length === 0 ? (
            <p className="border-t border-border px-4 py-3 text-sm text-muted">No town or city found with that name. Try another spelling.</p>
          ) : (
            <div className="border-t border-border">
              <p className="px-4 pt-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Add from the world map</p>
              {world.map((place) => (
                <button
                  key={place.key}
                  type="button"
                  disabled={busy}
                  onClick={() => addPlace(place)}
                  className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-sm hover:bg-sand"
                >
                  <Globe2 size={14} className="mt-0.5 shrink-0 text-teal" />
                  <span>
                    <span className="font-semibold text-ink">{place.name}</span>
                    <span className="text-muted">{[place.state, place.country].filter(Boolean).map((part) => `, ${part}`).join('')}</span>
                  </span>
                </button>
              ))}
              <p className="px-4 pb-2.5 pt-1 text-[11px] text-muted">Search by OpenStreetMap Nominatim</p>
            </div>
          )}
          {error && <p className="border-t border-border px-4 py-2.5 text-sm text-ember">{error}</p>}
        </div>
      )}
    </div>
  );
}
