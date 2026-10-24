import { apiGet, apiPost, type PageResponse } from './apiClient';
import type { Center, CenterType, City, Country, FeedbackType, Meditator, NearbyResult, Program, SearchResult, Teacher } from '../types/api';
import type { GlobeMarker } from '../features/globe/types';

export type CityTeachersParams = {
  page?: number;
  size?: number;
  q?: string;
  programId?: number;
  nearMe?: boolean;
  lat?: number;
  lng?: number;
  sort?: string;
};

export type CityCentersParams = {
  page?: number;
  size?: number;
  q?: string;
  type?: CenterType;
  sort?: string;
};

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  return query ? `?${query}` : '';
}

export const resourcesApi = {
  countries: (page = 0, size = 20) => apiGet<PageResponse<Country>>(`/countries?page=${page}&size=${size}&sort=name`),
  cities: (page = 0, size = 20) => apiGet<PageResponse<City>>(`/cities?page=${page}&size=${size}&sort=name`),
  cityBySlug: (slug: string) => apiGet<City>(`/cities/slug/${slug}`),
  cityTeachers: (id: number, params: CityTeachersParams = {}) =>
    apiGet<PageResponse<Teacher>>(
      `/cities/${id}/teachers${buildQuery({
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? 'name',
        q: params.q,
        programId: params.programId,
        nearMe: params.nearMe ? true : undefined,
        lat: params.lat,
        lng: params.lng,
      })}`,
    ),
  cityCenters: (id: number, params: CityCentersParams = {}) =>
    apiGet<PageResponse<Center>>(
      `/cities/${id}/centers${buildQuery({
        page: params.page ?? 0,
        size: params.size ?? 20,
        sort: params.sort ?? 'name',
        q: params.q,
        type: params.type,
      })}`,
    ),
  centers: (type?: CenterType) => apiGet<PageResponse<Center>>(`/centers?size=100&sort=name${type ? `&type=${type}` : ''}`),
  centerBySlug: (slug: string) => apiGet<Center>(`/centers/slug/${slug}`),
  teachers: () => apiGet<PageResponse<Teacher>>('/teachers?size=100&sort=name'),
  teacherBySlug: (slug: string) => apiGet<Teacher>(`/teachers/slug/${slug}`),
  programs: () => apiGet<PageResponse<Program>>('/programs?size=100&sort=name'),
  search: (query: string) => apiGet<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`),
  globeMarkers: (level = 'country') => apiGet<GlobeMarker[]>(`/globe/markers?level=${level}`),
  nearby: (params: { lat: number; lng: number; radiusKm?: number; types?: string; limit?: number }) =>
    apiGet<NearbyResult[]>(
      `/nearby${buildQuery({
        lat: params.lat,
        lng: params.lng,
        radiusKm: params.radiusKm ?? 100,
        types: params.types,
        limit: params.limit ?? 50,
      })}`,
    ),
  meditators: (cityId: number, size = 200) => apiGet<PageResponse<Meditator>>(`/meditators?cityId=${cityId}&size=${size}`),
  submitFeedback: (body: { name?: string; email?: string; type: FeedbackType; message: string }) =>
    apiPost('/feedback', body),
};
