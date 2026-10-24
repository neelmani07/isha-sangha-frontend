import { BookHeart, ChevronDown, Compass, Minus, Navigation, Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { EntityIcon } from '../../../components/brand/EntityIcon';
import { Ornament } from '../../../components/brand/Ornament';
import { SearchField } from '../../../components/ui/Form';
import { resourcesApi } from '../../../api/resources';
import { useElementSize } from '../../../hooks/useElementSize';
import { mockMarkers } from '../data/mockMarkers';
import type { GlobeMarker } from '../types';
import { symbols } from '../../../components/maps/mapSymbols';
import { BackdropPhoto } from '../../../components/ui/BackdropPhoto';
import { sitePhotos } from '../../../content/sitePhotos';
import { NightSky } from './NightSky';
import {
  filterMarkersForView,
  flyToAltitude,
  getZoomTier,
  INDIA_HOME_VIEW,
  markerColor,
  pointAltitude,
  pointRadius,
  spreadDenseMarkers,
  zoomTierMeta,
  type MarkerFilter,
} from '../utils/globeZoom';
import {
  HYBRID_SATELLITE_ENTER_ALTITUDE,
  nextImageryMode,
  SATELLITE_ATTRIBUTION,
  satelliteTileUrl,
  type GlobeImageryMode,
} from '../utils/globeImagery';

const markerFilters: { label: string; value: MarkerFilter; color?: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Countries', value: 'country', color: symbols.COUNTRY.globeColor },
  { label: 'Cities', value: 'city', color: symbols.CITY.globeColor },
  { label: 'Centers', value: 'center', color: symbols.CITY_CENTER.globeColor },
  { label: 'Teachers', value: 'teacher', color: symbols.TEACHER.globeColor },
  { label: 'Meditators', value: 'meditator', color: symbols.MEDITATOR.globeColor },
];

const MIN_ALTITUDE = 0.02;
const MAX_ALTITUDE = 6;

/** Isha Yoga Center, Coimbatore: the source of the arcs drawn across the globe. */
const SOURCE = { lat: 10.9724, lng: 76.7366 };
const CENTER_TYPES = ['CENTER', 'MAJOR_CENTER', 'CITY_CENTER', 'DEVI_TEMPLE', 'ISHA_SHOP'];

type Arc = { startLat: number; startLng: number; endLat: number; endLng: number };
type Ring = { lat: number; lng: number };

type GlobeExplorerProps = {
  /** Scrolls the surrounding page to one of its sections (e.g. "nearby"). */
  onJumpToSection: (sectionId: string) => void;
};

/**
 * Globe hero for the Explore page. Wheel-zoom is off by default so the page can scroll past the globe;
 * it turns on once the visitor clicks into the globe (until the pointer leaves) or holds Ctrl/⌘ while scrolling.
 */
export function GlobeExplorer({ onJumpToSection }: GlobeExplorerProps) {
  const navigate = useNavigate();
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const centeredRef = useRef(false);
  const [containerRef, size] = useElementSize<HTMLDivElement>();
  const [query, setQuery] = useState('');
  const [markerFilter, setMarkerFilter] = useState<MarkerFilter>('all');
  const [selectedMarker, setSelectedMarker] = useState<GlobeMarker | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<GlobeMarker | null>(null);
  const [cameraAltitude, setCameraAltitude] = useState(INDIA_HOME_VIEW.altitude);
  const [imageryMode, setImageryMode] = useState<GlobeImageryMode>('marble');
  const imageryModeRef = useRef<GlobeImageryMode>('marble');
  const [zoomActive, setZoomActive] = useState(false);
  const [wheelHint, setWheelHint] = useState(false);
  const wheelHintTimer = useRef<number | undefined>(undefined);

  const zoomTier = getZoomTier(cameraAltitude);
  const useSatelliteImagery = imageryMode === 'satellite';
  const showFlourishes = zoomTier === 'world' || zoomTier === 'region';

  const { data, isError, isLoading } = useQuery({
    queryKey: ['globe-markers', markerFilter],
    queryFn: () => fetchMarkers(markerFilter),
  });
  const { data: allMarkers } = useQuery({
    queryKey: ['globe-markers', 'all'],
    queryFn: () => fetchMarkers('all'),
  });

  const rawMarkers = data?.length ? data : mockMarkers;
  const everything = allMarkers?.length ? allMarkers : mockMarkers;

  const markers = useMemo(() => {
    const filtered = filterMarkersForView(rawMarkers, markerFilter, zoomTier);
    return spreadDenseMarkers(filtered, zoomTier);
  }, [rawMarkers, markerFilter, zoomTier]);

  const stats = useMemo(() => summarize(everything), [everything]);
  const { arcs, rings } = useMemo(() => buildFlourishes(everything), [everything]);

  useEffect(() => {
    if (!useSatelliteImagery) {
      globeRef.current?.globeTileEngineClearCache();
    }
  }, [useSatelliteImagery]);

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.enableZoom = zoomActive;
    }
  }, [zoomActive]);

  useEffect(() => () => window.clearTimeout(wheelHintTimer.current), []);

  function stopAutoRotate() {
    const controls = globeRef.current?.controls();
    if (controls) controls.autoRotate = false;
  }

  function handleZoom(altitude: number) {
    setCameraAltitude(altitude);

    const next = nextImageryMode(imageryModeRef.current, altitude);
    if (next !== imageryModeRef.current) {
      imageryModeRef.current = next;
      setImageryMode(next);
    }
  }

  function setupGlobeControls() {
    const globe = globeRef.current;
    if (!globe) {
      return;
    }

    if (!centeredRef.current) {
      globe.pointOfView(INDIA_HOME_VIEW, 0);
      setCameraAltitude(INDIA_HOME_VIEW.altitude);
      centeredRef.current = true;
    }

    const globeR = globe.getGlobeRadius();
    const controls = globe.controls();
    controls.minDistance = globeR + 0.001;
    controls.maxDistance = globeR * 100;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.12;
    controls.zoomSpeed = 0.45;
    controls.enableZoom = zoomActive;
    // A slow drift until the visitor first touches the globe.
    controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotateSpeed = 0.3;
    controls.update();
  }

  // Runs in the capture phase, before OrbitControls sees the wheel event on the canvas.
  function handleWheelCapture(event: React.WheelEvent) {
    const controls = globeRef.current?.controls();
    if (!controls || zoomActive) {
      return;
    }

    const modifierZoom = event.ctrlKey || event.metaKey;
    controls.enableZoom = modifierZoom;

    if (!modifierZoom) {
      setWheelHint(true);
      window.clearTimeout(wheelHintTimer.current);
      wheelHintTimer.current = window.setTimeout(() => setWheelHint(false), 1400);
    } else {
      stopAutoRotate();
    }
  }

  function zoomBy(factor: number) {
    const globe = globeRef.current;
    if (!globe) return;
    stopAutoRotate();
    const current = globe.pointOfView();
    const altitude = Math.min(MAX_ALTITUDE, Math.max(MIN_ALTITUDE, current.altitude * factor));
    globe.pointOfView({ ...current, altitude }, 450);
    handleZoom(altitude);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleMarkerClick(marker: GlobeMarker) {
    stopAutoRotate();
    setSelectedMarker(marker);
    setHoveredMarker(null);

    const targetAltitude = flyToAltitude(marker);
    if (targetAltitude < HYBRID_SATELLITE_ENTER_ALTITUDE) {
      imageryModeRef.current = 'satellite';
      setImageryMode('satellite');
    }

    globeRef.current?.pointOfView({ lat: marker.lat, lng: marker.lng, altitude: targetAltitude }, 900);
    handleZoom(targetAltitude);
  }

  return (
    <section
      id="globe"
      aria-label="Globe explorer"
      className="relative h-[calc(82svh+var(--header-h))] min-h-[640px] overflow-hidden font-body text-cream lg:h-[100svh] lg:min-h-[700px]"
    >
      <NightSky />
      <BackdropPhoto photo={sitePhotos.velliangiriMist} variant="horizon" position="center 40%" className="opacity-[0.22] mix-blend-luminosity" />

      {/* The globe sits right of the intro column on large screens, centred on small ones. */}
      <div
        ref={containerRef}
        className="absolute inset-x-0 bottom-0 top-[var(--header-h)] lg:left-[34%]"
        onPointerDown={() => {
          setZoomActive(true);
          stopAutoRotate();
        }}
        onMouseLeave={() => setZoomActive(false)}
        onWheelCapture={handleWheelCapture}
      >
        {size.width > 0 && (
          <Globe
            ref={globeRef}
            width={size.width}
            height={size.height}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            globeTileEngineUrl={useSatelliteImagery ? satelliteTileUrl : undefined}
            showAtmosphere
            atmosphereColor="#f3c27a"
            atmosphereAltitude={0.2}
            onGlobeReady={setupGlobeControls}
            pointsData={markers}
            pointLat={(marker) => (marker as GlobeMarker).lat}
            pointLng={(marker) => (marker as GlobeMarker).lng}
            pointAltitude={pointAltitude}
            pointRadius={(marker) => pointRadius(marker as GlobeMarker, markerFilter, cameraAltitude)}
            pointColor={(marker) => markerColor(marker as GlobeMarker, markerFilter)}
            pointResolution={20}
            pointsMerge={false}
            pointsTransitionDuration={180}
            onPointClick={(marker) => handleMarkerClick(marker as GlobeMarker)}
            onPointHover={(marker) => setHoveredMarker((marker as GlobeMarker | null) ?? null)}
            arcsData={showFlourishes ? arcs : []}
            arcStartLat={(arc) => (arc as Arc).startLat}
            arcStartLng={(arc) => (arc as Arc).startLng}
            arcEndLat={(arc) => (arc as Arc).endLat}
            arcEndLng={(arc) => (arc as Arc).endLng}
            arcColor={() => ['rgba(243, 194, 122, 0.85)', 'rgba(207, 69, 32, 0.55)']}
            arcStroke={0.45}
            arcAltitudeAutoScale={0.38}
            arcDashLength={0.35}
            arcDashGap={0.25}
            arcDashInitialGap={(arc) => ((arc as Arc).endLng % 7) / 7}
            arcDashAnimateTime={4200}
            arcsTransitionDuration={0}
            ringsData={showFlourishes ? rings : []}
            ringLat={(ring) => (ring as Ring).lat}
            ringLng={(ring) => (ring as Ring).lng}
            ringColor={() => (t: number) => `rgba(243, 194, 122, ${Math.max(0, 1 - t)})`}
            ringMaxRadius={3.2}
            ringPropagationSpeed={1.6}
            ringRepeatPeriod={1600}
            onZoom={({ altitude }) => handleZoom(altitude ?? INDIA_HOME_VIEW.altitude)}
          />
        )}
      </div>

      {/* Compact title (small screens) */}
      <div className="pointer-events-none absolute left-4 right-4 top-[calc(var(--header-h)+1.25rem)] z-20 lg:hidden">
        <h1 className="font-display text-3xl font-normal leading-tight text-cream sm:text-4xl">
          Find Isha <span className="italic text-gold-light">wherever you are</span>
        </h1>
      </div>

      <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-cream/15 bg-ink/40 text-cream shadow-panel backdrop-blur-md sm:flex lg:right-8">
        <button type="button" onClick={() => zoomBy(0.55)} className="grid h-10 w-10 place-items-center hover:bg-cream/10" aria-label="Zoom in">
          <Plus size={18} />
        </button>
        <span className="h-px bg-cream/15" />
        <button type="button" onClick={() => zoomBy(1.8)} className="grid h-10 w-10 place-items-center hover:bg-cream/10" aria-label="Zoom out">
          <Minus size={18} />
        </button>
      </div>

      {wheelHint && (
        <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center bg-ink/30 animate-fade-in">
          <p className="rounded-lg bg-ink/90 px-5 py-3 text-sm font-semibold text-cream shadow-panel">
            Click the globe, or hold {isMac() ? '⌘' : 'Ctrl'} while scrolling, to zoom
          </p>
        </div>
      )}

      {useSatelliteImagery && (
        <p className="pointer-events-none absolute bottom-16 right-4 z-20 hidden max-w-[220px] text-right text-[10px] leading-snug text-cream/50 sm:block lg:right-8">
          {SATELLITE_ATTRIBUTION}
        </p>
      )}

      {hoveredMarker && !selectedMarker && (
        <div className="pointer-events-none absolute left-1/2 top-[calc(var(--header-h)+5rem)] z-30 w-[min(320px,calc(100vw-2rem))] -translate-x-1/2 animate-slide-up rounded-lg border border-border bg-cream/95 p-4 text-ink shadow-panel backdrop-blur-md lg:left-[67%] lg:top-[calc(var(--header-h)+2rem)]">
          <p className="text-xs uppercase tracking-[0.22em] text-saffron">{displayType(hoveredMarker, markerFilter)}</p>
          <h2 className="mt-2 font-display text-2xl text-ink">{hoveredMarker.name}</h2>
          <p className="mt-2 text-sm text-muted">{miniInfo(hoveredMarker, markerFilter)}</p>
        </div>
      )}

      {/* One column: intro + filters + search. Bottom-anchored on small screens, vertically centred on the left on large ones. */}
      <div className="absolute bottom-14 left-4 right-4 z-20 lg:bottom-0 lg:top-[var(--header-h)] lg:left-8 lg:right-auto lg:flex lg:w-[min(38%,520px)] lg:flex-col lg:justify-center lg:py-10 xl:left-14">
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-light/80">Discover</p>
          <h1 className="mt-4 font-display text-5xl font-normal leading-[1.05] tracking-tight text-cream xl:text-6xl">
            Find Isha
            <span className="mt-1 block italic text-gold-light">wherever you are</span>
          </h1>
          <Ornament tone="light" className="mt-6 opacity-70" />
          <p className="mt-5 max-w-md text-lg leading-relaxed text-cream/75">
            Centers, teachers, temples and fellow seekers across the world, and the stories that connect them.
          </p>
          <HeroStats stats={stats} />
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onJumpToSection('nearby')}
              className="inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-3 text-sm font-semibold text-cream shadow-glow transition hover:bg-saffron-dark"
            >
              <Navigation size={16} /> Find near me
            </button>
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 rounded-md border border-cream/25 bg-cream/5 px-5 py-3 text-sm font-semibold text-cream backdrop-blur-sm transition hover:border-cream/50 hover:bg-cream/10"
            >
              <BookHeart size={16} /> Read stories
            </Link>
          </div>
        </div>
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 lg:mt-8" role="group" aria-label="Marker type">
          {markerFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={markerFilter === filter.value}
              onClick={() => {
                setMarkerFilter(filter.value);
                setSelectedMarker(null);
              }}
              className={`inline-flex shrink-0 items-center gap-2 rounded-pill border px-3.5 py-1.5 text-sm font-semibold backdrop-blur-md transition ${
                markerFilter === filter.value
                  ? 'border-gold-light/70 bg-cream text-ink'
                  : 'border-cream/20 bg-ink/35 text-cream/85 hover:border-cream/40 hover:text-cream'
              }`}
            >
              {filter.color && <span className="h-2 w-2 rounded-pill" style={{ background: filter.color }} aria-hidden />}
              {filter.label}
            </button>
          ))}
        </div>
        <form onSubmit={submitSearch}>
          <SearchField value={query} onChange={setQuery} placeholder="Search cities, centers, teachers" />
        </form>
        <p className="mt-2.5 text-xs text-cream/60">
          {isLoading && 'Loading live markers...'}
          {isError && 'Backend is not reachable, showing sample markers.'}
          {!isLoading && !isError && (
            <>
              {markers.length} markers · {zoomTierMeta[zoomTier].label}
              {useSatelliteImagery ? ' · satellite detail' : ''} · {zoomActive ? zoomTierMeta[zoomTier].hint : 'Click the globe to zoom'}
            </>
          )}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onJumpToSection('nearby')}
        className="absolute bottom-3 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-1 rounded-pill border border-cream/20 bg-ink/40 px-4 py-1.5 text-xs font-semibold text-cream/80 backdrop-blur-md hover:text-cream lg:left-[67%]"
      >
        Scroll to explore
        <ChevronDown size={14} className="animate-bounce" />
      </button>

      {selectedMarker && (
        <aside className="absolute bottom-0 right-0 z-30 w-full animate-slide-up rounded-t-xl border-t border-border bg-cream text-ink shadow-panel sm:bottom-6 sm:right-6 sm:w-[390px] sm:rounded-xl sm:border lg:bottom-8 lg:right-20">
          <div className="flex flex-col gap-6 p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-saffron">{displayType(selectedMarker, markerFilter)}</p>
                <h2 className="mt-2 font-display text-3xl">{selectedMarker.name}</h2>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="grid h-10 w-10 place-items-center rounded-md border border-border bg-sand transition hover:bg-sand/80"
                aria-label="Close marker details"
                title="Close marker details"
              >
                <X size={18} />
              </button>
            </div>

            {selectedMarker.teacherCount != null && (
              <div className="rounded-md border border-border bg-sand/60 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted">Teachers</p>
                <p className="mt-2 font-display text-3xl text-ink">{selectedMarker.teacherCount}</p>
              </div>
            )}

            <p className="text-sm leading-6 text-muted">{miniInfo(selectedMarker, markerFilter)}</p>

            <div className="flex flex-wrap gap-2">
              <Link className="inline-flex items-center gap-2 rounded-md bg-saffron px-4 py-3 text-sm font-semibold text-cream hover:bg-saffron-dark" to={detailsHref(selectedMarker)}>
                <EntityIcon kind={selectedMarker.type} size="sm" showBackground={false} />
                {primaryActionLabel(selectedMarker, markerFilter)}
              </Link>
              <button
                type="button"
                onClick={() => onJumpToSection('nearby')}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-saffron/40"
              >
                <Navigation size={16} />
                Find nearby
              </button>
              <Link className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-3 text-sm font-semibold text-ink hover:border-saffron/40" to={`/search?q=${encodeURIComponent(selectedMarker.name)}`}>
                <Compass size={16} />
                Search
              </Link>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
}

function HeroStats({ stats }: { stats: ReturnType<typeof summarize> }) {
  const items = [
    { value: stats.countries, label: 'countries' },
    { value: stats.cities, label: 'cities' },
    { value: stats.centers, label: 'centers' },
    { value: stats.teachers, label: 'teachers' },
    { value: stats.meditators, label: 'meditators' },
  ];

  return (
    <dl className="mt-7 grid max-w-lg grid-cols-5 gap-3 border-y border-cream/10 py-4">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="sr-only">{item.label}</dt>
          <dd className="font-display text-2xl text-gold-light xl:text-3xl">{item.value.toLocaleString()}</dd>
          <dd className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-cream/55">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function summarize(markers: GlobeMarker[]) {
  const countries = markers.filter((m) => m.type === 'COUNTRY');
  return {
    countries: countries.length,
    cities: markers.filter((m) => m.type === 'CITY').length,
    centers: markers.filter((m) => CENTER_TYPES.includes(m.type)).length,
    teachers: countries.reduce((sum, m) => sum + (m.teacherCount ?? 0), 0),
    meditators: markers.filter((m) => m.type === 'CITY').reduce((sum, m) => sum + (m.meditatorCount ?? 0), 0),
  };
}

/** Arcs from the Isha Yoga Center to major centers and countries; pulsing rings on major centers. */
function buildFlourishes(markers: GlobeMarker[]) {
  const majors = markers.filter((m) => m.type === 'MAJOR_CENTER');
  const far = (m: GlobeMarker) => Math.abs(m.lat - SOURCE.lat) + Math.abs(m.lng - SOURCE.lng) > 8;
  const targets = [...majors.filter(far), ...markers.filter((m) => m.type === 'COUNTRY' && far(m))].slice(0, 24);

  return {
    arcs: targets.map<Arc>((m) => ({ startLat: SOURCE.lat, startLng: SOURCE.lng, endLat: m.lat, endLng: m.lng })),
    rings: [SOURCE, ...majors.filter(far).map((m) => ({ lat: m.lat, lng: m.lng }))] as Ring[],
  };
}

function isMac() {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
}

async function fetchMarkers(filter: MarkerFilter) {
  if (filter === 'teacher') {
    return resourcesApi.globeMarkers('city');
  }

  if (filter !== 'all') {
    return resourcesApi.globeMarkers(filter);
  }

  const [countries, cities, centers, meditators] = await Promise.all([
    resourcesApi.globeMarkers('country'),
    resourcesApi.globeMarkers('city'),
    resourcesApi.globeMarkers('center'),
    resourcesApi.globeMarkers('meditator'),
  ]);

  return [...countries, ...cities, ...centers, ...meditators];
}

function displayType(marker: GlobeMarker, filter: MarkerFilter) {
  if (filter === 'teacher' && marker.type === 'CITY') {
    return 'teacher hub';
  }

  return marker.type.replace(/_/g, ' ');
}

function miniInfo(marker: GlobeMarker, filter: MarkerFilter) {
  if (filter === 'teacher' && marker.type === 'CITY') {
    const count = marker.teacherCount ?? 0;
    return `${count.toLocaleString()} Hatha Yoga teachers in this city. Click to browse the full list.`;
  }

  if (marker.type === 'COUNTRY') {
    return `${marker.teacherCount ?? 0} teachers represented in this country-level view.`;
  }

  if (marker.type === 'CITY') {
    const meditators = marker.meditatorCount ? ` and ${marker.meditatorCount} meditators` : '';
    return `${marker.teacherCount ?? 0} teachers${meditators} here. Click to open the city page with centers and local statistics.`;
  }

  if (marker.type === 'TEACHER') {
    return 'Isha Hatha Yoga teacher marker. Click to open the teacher profile.';
  }

  if (marker.type === 'MEDITATOR') {
    return 'A member of the community. For privacy, their dot sits at an approximate spot in their city.';
  }

  return 'Isha location marker. Click to view center details and contact links.';
}

function primaryActionLabel(marker: GlobeMarker, filter: MarkerFilter) {
  if (filter === 'teacher' && marker.type === 'CITY') {
    return 'Browse teachers';
  }

  if (marker.type === 'MEDITATOR') {
    return 'See their city';
  }

  return 'Open details';
}

function detailsHref(marker: GlobeMarker) {
  if (marker.slug && marker.type === 'CITY') {
    return `/city/${marker.slug}`;
  }

  if (marker.slug && marker.type === 'TEACHER') {
    return `/teacher/${marker.slug}`;
  }

  // Meditators carry their city's slug: open the city page, never a personal page.
  if (marker.slug && marker.type === 'MEDITATOR') {
    return `/city/${marker.slug}`;
  }

  if (marker.slug && CENTER_TYPES.includes(marker.type)) {
    return `/center/${marker.slug}`;
  }

  return `/search?q=${encodeURIComponent(marker.name)}`;
}
