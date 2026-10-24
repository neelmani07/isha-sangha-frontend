import { apiDelete, apiGet, apiPost, apiPut, type PageResponse, setAdminToken } from '../../../api/apiClient';
import type { Center, City, Country, Program, Teacher } from '../../../types/api';

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
  deleteCountry: (id: number) => apiDelete<void>(`/admin/countries/${id}`),
};

