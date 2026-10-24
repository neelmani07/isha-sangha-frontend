/** Switch to satellite tiles when camera drops below this altitude (globe-radius units). */
export const HYBRID_SATELLITE_ENTER_ALTITUDE = 1.12;

/** Switch back to blue marble when camera rises above this (hysteresis avoids flicker). */
export const HYBRID_SATELLITE_EXIT_ALTITUDE = 1.28;

export type GlobeImageryMode = 'marble' | 'satellite';

export function nextImageryMode(current: GlobeImageryMode, altitude: number): GlobeImageryMode {
  if (current === 'marble') {
    return altitude < HYBRID_SATELLITE_ENTER_ALTITUDE ? 'satellite' : 'marble';
  }

  return altitude > HYBRID_SATELLITE_EXIT_ALTITUDE ? 'marble' : 'satellite';
}

/**
 * Esri World Imagery — satellite tiles, no API key required for reasonable dev/demo use.
 * Same class of imagery radio.garden uses (aerial, multi-zoom).
 */
export function satelliteTileUrl(x: number, y: number, level: number) {
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${level}/${y}/${x}`;
}

export const SATELLITE_ATTRIBUTION =
  'Satellite imagery © Esri — Maxar, Earthstar Geographics, and the GIS User Community';
