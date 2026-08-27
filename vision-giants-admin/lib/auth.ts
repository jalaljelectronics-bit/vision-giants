// lib/auth.ts
import type { Admin } from '@/types';
import { adminApi } from './api';

/**
 * Calls the backend to validate the current session (httpOnly cookie)
 * and return the logged-in admin's profile. Returns null if not authenticated.
 */
export async function getCurrentAdmin(): Promise<Admin | null> {
  try {
    const res = await adminApi.get<Admin>('/auth/me');
    return res.data;
  } catch {
    return null;
  }
}

export async function loginAdmin(email: string, password: string): Promise<Admin> {
  const res = await adminApi.post<Admin>('/auth/login', { email, password });
  if (!res.success || !res.data) {
    throw new Error(res.error ?? 'Login failed');
  }
  return res.data;
}

export async function logoutAdmin(): Promise<void> {
  await adminApi.post('/auth/logout', {});
}