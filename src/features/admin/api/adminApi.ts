import { apiAdminBlob, apiDelete, apiGet, apiPost, apiPut, type PageResponse, setAdminToken } from '../../../api/apiClient';
import type { Center, City, Country, Initiative, Program, ResourceLink, Teacher } from '../../../types/api';
import type { ListingKind, ListingStatus } from '../../join/api/joinApi';

export type ReviewItem = {
  kind: ListingKind;
  id: number;
  status: ListingStatus;
  submittedByEmail: string;
  proofKey: string | null;
  submittedAt: string;
  rejectionReason: string | null;
  teacher: Teacher | null;
  center: Center | null;
  initiative: Initiative | null;
  resource: ResourceLink | null;
};

type LoginResponse = {
  token: string;
  email: string;
  role: string;
};

export const adminApi = {
  async login(email: string, password: string) {
    const response = await apiPost<LoginResponse>('/admin/auth/login', { email, password });
    setAdminToken(response.token);
    return response;
  },
  dashboard: async () => {
    const [countries, cities, teachers, centers, programs] = await Promise.all([
      apiGet<PageResponse<Country>>('/countries?size=5'),
      apiGet<PageResponse<City>>('/cities?size=5'),
      apiGet<PageResponse<Teacher>>('/teachers?size=5'),
      apiGet<PageResponse<Center>>('/centers?size=5'),
      apiGet<PageResponse<Program>>('/programs?size=5'),
    ]);

    return { countries, cities, teachers, centers, programs };
  },
  createCountry: (body: Partial<Country>) => apiPost<Country>('/admin/countries', body),
  createCity: (body: unknown) => apiPost<City>('/admin/cities', body),
  createCenter: (body: unknown) => apiPost<Center>('/admin/centers', body),
  createTeacher: (body: unknown) => apiPost<Teacher>('/admin/teachers', body),
  createProgram: (body: unknown) => apiPost<Program>('/admin/programs', body),
  updateCountry: (id: number, body: Partial<Country>) => apiPut<Country>(`/admin/countries/${id}`, body),
  reviewQueue: (status: ListingStatus) => apiGet<ReviewItem[]>(`/admin/listings?status=${status}`),
  approveListing: (kind: ListingKind, id: number) => apiPost<null>(`/admin/listings/${kind.toLowerCase()}/${id}/approve`, {}),
  rejectListing: (kind: ListingKind, id: number, reason: string) =>
    apiPost<null>(`/admin/listings/${kind.toLowerCase()}/${id}/reject`, { reason }),
  proof: (key: string) => apiAdminBlob(`/admin/proofs/${encodeURIComponent(key)}`),
  deleteCountry: (id: number) => apiDelete<void>(`/admin/countries/${id}`),
};

