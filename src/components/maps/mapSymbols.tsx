import L from 'leaflet';

/**
 * One symbol per kind of entity, shared by every map. Each kind differs in shape AND colour so the
 * maps stay readable for colour-blind visitors. The 3D globe can only draw dots, so it uses
 * `globeColor` (a brighter tint that reads on the night sky) and size instead of shape.
 */
export type SymbolKind =
  | 'MAJOR_CENTER'
  | 'CITY_CENTER'
  | 'CENTER'
  | 'DEVI_TEMPLE'
  | 'ISHA_SHOP'
  | 'TEACHER'
  | 'MEDITATOR'
  | 'CITY'
  | 'COUNTRY'
  | 'YOU';

type SymbolStyle = { label: string; color: string; globeColor: string; size: number; shape: (fill: string) => string };

const CREAM = '#f9f6f1';

const circle = (r: number) => (fill: string) =>
  `<circle cx="12" cy="12" r="${r}" fill="${fill}" stroke="${CREAM}" stroke-width="2.5"/>`;

export const symbols: Record<SymbolKind, SymbolStyle> = {
  MAJOR_CENTER: {
    label: 'Ashram',
    color: '#b8862b',
    globeColor: '#f0b84a',
    size: 30,
    shape: (fill) =>
      `<circle cx="12" cy="12" r="10.5" fill="${CREAM}" stroke="${fill}" stroke-width="1.6"/><circle cx="12" cy="12" r="7" fill="${fill}"/><circle cx="12" cy="12" r="2.2" fill="${CREAM}"/>`,
  },
  CITY_CENTER: { label: 'Centre', color: '#cf4520', globeColor: '#ff7a45', size: 24, shape: circle(7.5) },
  CENTER: { label: 'Centre', color: '#cf4520', globeColor: '#ff7a45', size: 24, shape: circle(7.5) },
  DEVI_TEMPLE: {
    label: 'Devi temple',
    color: '#a3202f',
    globeColor: '#ff5a6e',
    size: 26,
    shape: (fill) => `<path d="M3.5 5.5 H20.5 L12 20.5 Z" fill="${fill}" stroke="${CREAM}" stroke-width="2" stroke-linejoin="round"/>`,
  },
  ISHA_SHOP: {
    label: 'Isha shop',
    color: '#3d7a52',
    globeColor: '#7fd69a',
    size: 24,
    shape: (fill) => `<rect x="5" y="5" width="14" height="14" rx="3.5" fill="${fill}" stroke="${CREAM}" stroke-width="2"/>`,
  },
  TEACHER: {
    label: 'Teacher',
    color: '#0b4a63',
    globeColor: '#62c6ea',
    size: 26,
    shape: (fill) => `<path d="M12 2.5 L21.5 12 L12 21.5 L2.5 12 Z" fill="${fill}" stroke="${CREAM}" stroke-width="2" stroke-linejoin="round"/>`,
  },
  MEDITATOR: { label: 'Meditator', color: '#5d9c7c', globeColor: '#b9e6cc', size: 16, shape: circle(5.5) },
  CITY: {
    label: 'City',
    color: '#28231e',
    globeColor: '#f3e6c8',
    size: 18,
    shape: (fill) => `<circle cx="12" cy="12" r="5" fill="${CREAM}" stroke="${fill}" stroke-width="2.5"/>`,
  },
  COUNTRY: { label: 'Country', color: '#b8862b', globeColor: '#f3d27a', size: 18, shape: circle(6) },
  YOU: {
    label: 'You',
    color: '#cf4520',
    globeColor: '#ff7a45',
    size: 28,
    shape: (fill) =>
      `<circle cx="12" cy="12" r="10" fill="${fill}" fill-opacity="0.18"/><circle cx="12" cy="12" r="5.5" fill="${fill}" stroke="${CREAM}" stroke-width="2.5"/>`,
  },
};

export function symbolFor(type: string): SymbolStyle {
  return symbols[(type in symbols ? type : 'CENTER') as SymbolKind];
}

function svg(kind: SymbolKind | string, highlighted: boolean, size: number) {
  const style = symbolFor(kind);
  const ring = highlighted ? `<circle cx="12" cy="12" r="11.3" fill="none" stroke="#28231e" stroke-width="1.4"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" style="display:block;filter:drop-shadow(0 1px 1.5px rgba(40,35,30,.35))">${style.shape(style.color)}${ring}</svg>`;
}

/** Leaflet icon for an entity type (e.g. "TEACHER", "DEVI_TEMPLE"). */
export function symbolIcon(kind: SymbolKind | string, highlighted = false) {
  const size = Math.round(symbolFor(kind).size * (highlighted ? 1.3 : 1));
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: svg(kind, highlighted, size),
  });
}

/** Small key explaining the symbols shown on a map. */
export function MapLegend({ kinds, className = '' }: { kinds: SymbolKind[]; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-muted ${className}`}>
      {kinds.map((kind) => (
        <span key={kind} className="inline-flex items-center gap-1.5">
          <span aria-hidden dangerouslySetInnerHTML={{ __html: svg(kind, false, 16) }} />
          {symbols[kind].label}
        </span>
      ))}
    </div>
  );
}
