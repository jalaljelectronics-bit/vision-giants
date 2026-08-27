// lib/api.ts
import type { ApiResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. https://api.vision-giants.com/api

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // sends the httpOnly admin_token cookie
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Session expired or not logged in — bounce to login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError('Unauthorized', 401);
  }

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(json.error ?? 'Request failed', res.status);
  }

  return json;
}

export const adminApi = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiError };