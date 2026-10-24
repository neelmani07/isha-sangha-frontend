import { apiGet, apiPost } from '../../../api/apiClient';

export type AppUser = {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

export type AuthResponse = {
  token: string;
  user: AppUser;
};

export const authApi = {
  me: () => apiGet<AppUser>('/auth/me'),
  google: (credential: string) => apiPost<AuthResponse>('/auth/google', { credential }),
  requestOtp: (email: string) => apiPost<{ email: string; expiresInSeconds: number }>('/auth/otp/request', { email }),
  verifyOtp: (email: string, code: string) => apiPost<AuthResponse>('/auth/otp/verify', { email, code }),
};
