import { MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { resourcesApi } from '../../../api/resources';
import { Input } from '../../../components/ui/Form';

export type PickedCity = { id: number; name: string; lat: number | null; lng: number | null };

/** Type-ahead city search backed by the site search; only cities already on the map can be picked. */
export function CityPicker({ value, onChange }: { value: PickedCity | null; onChange: (city: PickedCity | null) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PickedCity[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
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

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-md border border-border bg-white px-4 py-3">
        <span className="inline-flex items-center gap-2 font-semibold text-ink">
          <MapPin size={16} className="text-saffron" /> {value.name}
        </span>
        <button type="button" onClick={() => onChange(null)} className="text-muted hover:text-ink" aria-label="Change city">
          <X size={18} />
        </button>
      </div>
    );
  }

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
      {open && query.trim().length >= 2 && (
        <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-md border border-border bg-white shadow-panel">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">
              No matching city on the map yet. Pick the nearest one, or tell us through Feedback.
            </p>
          ) : (
            results.map((city) => (
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
            ))
          )}
        </div>
      )}
    </div>
  );
}
