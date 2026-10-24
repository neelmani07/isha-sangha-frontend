import { apiAdminBlob, apiDelete, apiGet, apiPost, apiPut, type PageResponse, setAdminToken } from '../../../api/apiClient';
import type { Center, City, Country, Initiative, Program, ResourceLink, ShopListing, Story, Teacher } from '../../../types/api';
import type { ListingKind, ListingStatus } from '../../join/api/joinApi';

export type ManageKind = 'CENTER' | 'TEACHER' | 'CITY' | 'MEDITATOR' | 'INITIATIVE' | 'RESOURCE' | 'STORY' | 'PRODUCT';

export type ManageRow = {
  kind: ManageKind;
  id: number;
  name: string;
  subtitle: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  active: boolean;
  lat: number | null;
  lng: number | null;
  publicPath: string | null;
};

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
  city: { id: number; name: string; stateName: string; countryName: string; lat: number; lng: number } | null;
  story: Story | null;
  product: ShopListing | null;
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
  manageSearch: (kind: ManageKind, q: string) => apiGet<ManageRow[]>(`/admin/manage/${kind}?q=${encodeURIComponent(q)}`),
  setVisibility: (kind: ManageKind, id: number, active: boolean) => apiPost<null>(`/admin/manage/${kind}/${id}/visibility`, { active }),
  setFeatured: (id: number, featured: boolean) => apiPost<null>(`/admin/manage/story/${id}/featured`, { active: featured }),
  centerDetails: (id: number) => apiGet<Center>(`/admin/manage/center/${id}/details`),
  teacherDetails: (id: number) => apiGet<Teacher>(`/admin/manage/teacher/${id}/details`),
  cityDetails: (id: number) => apiGet<City>(`/admin/manage/city/${id}/details`),
  updateCenter: (id: number, body: unknown) => apiPut<Center>(`/admin/centers/${id}`, body),
  updateTeacher: (id: number, body: unknown) => apiPut<Teacher>(`/admin/teachers/${id}`, body),
  updateCity: (id: number, body: unknown) => apiPut<City>(`/admin/cities/${id}`, body),
  deleteCountry: (id: number) => apiDelete<void>(`/admin/countries/${id}`),
};

