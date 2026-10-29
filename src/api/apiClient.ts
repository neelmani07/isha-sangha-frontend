// Set VITE_API_URL when building for production, e.g. https://api.example.org/api/v1.
// The "/api/v1" part may be left off (https://api.example.org works too); it is added here.
function apiBase(raw: string) {
  const base = raw.trim().replace(/\/+$/, '');
  return base.endsWith('/api/v1') ? base : `${base}/api/v1`;
}

const API_URL = apiBase(import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8080' : ''));

const ADMIN_TOKEN_KEY = 'isha-world-admin-token';
const USER_TOKEN_KEY = 'isha-world-user-token';

/** Turns a media path from the API (e.g. "/api/v1/images/…") into a full URL; leaves other URLs alone. */
export function mediaUrl(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith('/api/') ? `${new URL(API_URL, window.location.origin).origin}${url}` : url;
}

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // Storage can be unavailable (private mode); the session then lasts for this tab only.
  }
}

export function getAdminToken() {
  return readStorage(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  writeStorage(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  writeStorage(ADMIN_TOKEN_KEY, null);
}

export function getUserToken() {
  return readStorage(USER_TOKEN_KEY);
}

export function setUserToken(token: string) {
  writeStorage(USER_TOKEN_KEY, token);
}

export function clearUserToken() {
  writeStorage(USER_TOKEN_KEY, null);
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, init);
}

export async function apiPost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...init,
  });
}

export async function apiPut<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...init,
  });
}

export async function apiDelete<T>(path: string, init?: RequestInit): Promise<T> {
  return apiRequest<T>(path, {
    method: 'DELETE',
    ...init,
  });
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  // Admin routes carry the admin token; everything else carries the signed-in user's token, if any.
  const token = path.startsWith('/admin') ? getAdminToken() : getUserToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    // Non-JSON error page (proxy, crash); fall through to a generic message.
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message ?? 'Request failed', response.status);
  }

  return payload.data;
}

/** Multipart upload of a single file (field name "file"). */
export async function apiUpload<T>(path: string, file: File): Promise<T> {
  const body = new FormData();
  body.append('file', file);
  const token = getUserToken();
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    body,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  let payload: ApiResponse<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    // fall through
  }

  if (!response.ok || !payload?.success) {
    throw new ApiError(payload?.message ?? 'Upload failed', response.status);
  }
  return payload.data;
}

/** Fetches a protected admin file (e.g. a proof document) as a blob. */
export async function apiAdminBlob(path: string): Promise<Blob> {
  const token = getAdminToken();
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new ApiError('Could not open the file', response.status);
  }
  return response.blob();
}
