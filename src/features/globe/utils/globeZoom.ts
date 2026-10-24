import { symbolFor } from '../../../components/maps/mapSymbols';
import type { GlobeMarker } from '../types';

export type MarkerFilter = 'all' | 'country' | 'city' | 'center' | 'teacher' | 'meditator';
export type ZoomTier = 'world' | 'region' | 'city' | 'local' | 'ground';

export const INDIA_HOME_VIEW = { lat: 22.5, lng: 79.0, altitude: 2.15 };

export const zoomTierMeta: Record<ZoomTier, { label: string; hint: string }> = {
  world: { label: 'World', hint: 'Countries as dots — scroll to zoom in' },
  region: { label: 'Region', hint: 'Cities appear as you zoom closer' },
  city: { label: 'City', hint: 'Centers and shops emerge — keep zooming' },
  local: { label: 'Local', hint: 'Street-level view with map detail' },
  ground: { label: 'Ground', hint: 'Closest view — click a dot for details' },
};

/** Camera altitude thresholds (globe-radius units). Lower = closer to surface. */
export function getZoomTier(altitude: number): ZoomTier {
  if (altitude >= 1.8) return 'world';
  if (altitude >= 0.65) return 'region';
  if (altitude >= 0.22) return 'city';
  if (altitude >= 0.07) return 'local';
  return 'ground';
}

export function filterMarkersForView(markers: GlobeMarker[], filter: MarkerFilter, tier: ZoomTier) {
  if (filter !== 'all') {
    return markers;
  }

  return markers.filter((marker) => {
    if (tier === 'world') {
      return marker.type === 'COUNTRY';
    }

    if (tier === 'region') {
      return marker.type === 'COUNTRY' || marker.type === 'CITY';
    }

    if (marker.type === 'COUNTRY') {
      return false;
    }

    return true;
  });
}

/** Tiny flat dots — radius in angular degrees (radio.garden style). */
export function pointRadius(marker: GlobeMarker, filter: MarkerFilter, cameraAltitude: number) {
  const zoomFactor = Math.min(1, Math.max(0.45, cameraAltitude / 0.18));

  if (filter === 'teacher' && marker.type === 'CITY') {
    const count = marker.teacherCount ?? 0;
    return Math.min(0.07, (0.038 + Math.log10(Math.max(count, 1) + 1) * 0.012) * zoomFactor);
  }

  if (marker.type === 'COUNTRY') {
    return 0.085 * zoomFactor;
  }

  if (marker.type === 'CITY') {
    return 0.052 * zoomFactor;
  }

  if (marker.type === 'TEACHER') {
    return 0.034 * zoomFactor;
  }

  if (marker.type === 'MEDITATOR') {
    return 0.022 * zoomFactor;
  }

  if (marker.type === 'MAJOR_CENTER') {
    return 0.05 * zoomFactor;
  }

  return 0.038 * zoomFactor;
}

export function pointAltitude() {
  return 0.002;
}

export function markerColor(marker: GlobeMarker, filter: MarkerFilter) {
  // In the Teachers view, cities stand in for their teachers.
  if (filter === 'teacher' && marker.type === 'CITY') {
    return symbolFor('TEACHER').globeColor;
  }

  return symbolFor(marker.type).globeColor;
}

export function flyToAltitude(marker: GlobeMarker) {
  if (marker.type === 'COUNTRY') return 0.85;
  if (marker.type === 'CITY') return 0.18;
  if (isCenterType(marker.type)) return 0.045;
  if (marker.type === 'TEACHER') return 0.035;
  return 0.12;
}

export function spreadDenseMarkers(markers: GlobeMarker[], tier: ZoomTier) {
  const seen = new Map<string, number>();
  const spreadUnit = tier === 'ground' ? 0.006 : tier === 'local' ? 0.012 : 0.022;

  return markers.map((marker) => {
    const key = `${marker.lat.toFixed(3)}:${marker.lng.toFixed(3)}:${marker.type}`;
    const index = seen.get(key) ?? 0;
    seen.set(key, index + 1);

    if (!isCenterType(marker.type)) {
      return marker;
    }

    const ring = Math.floor(index / 10) + 1;
    const angle = ((index % 10) / 10) * Math.PI * 2;
    const radius = spreadUnit * ring;

    return {
      ...marker,
      lat: marker.lat + Math.sin(angle) * radius,
      lng: marker.lng + Math.cos(angle) * radius,
    };
  });
}

function isCenterType(type: GlobeMarker['type']) {
  return ['CENTER', 'MAJOR_CENTER', 'CITY_CENTER', 'DEVI_TEMPLE', 'ISHA_SHOP'].includes(type);
}
