import { apiGet } from '../../../api/apiClient';
import type { GlobeMarker } from '../types';

export function getGlobeMarkers(level = 'country', type?: string) {
  const params = new URLSearchParams({ level });

  if (type) {
    params.set('type', type);
  }

  return apiGet<GlobeMarker[]>(`/globe/markers?${params.toString()}`);
}

