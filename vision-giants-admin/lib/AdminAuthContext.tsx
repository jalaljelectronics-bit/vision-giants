// lib/AdminAuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter } from 'next/router';
import type { Admin } from '@/types';
import { getCurrentAdmin, loginAdmin, logoutAdmin } from './auth';

interface AdminAuthContextValue {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Skip the session check on the login page itself
    if (router.pathname === '/login') {
      setIsLoading(false);
      return;
    }

    getCurrentAdmin()
      .then(setAdmin)
      .finally(() => setIsLoading(false));
  }, [router.pathname]);

  async function login(email: string, password: string) {
    const loggedInAdmin = await loginAdmin(email, password);
    setAdmin(loggedInAdmin);
    router.push('/');
  }

  async function logout() {
    await logoutAdmin();
    setAdmin(null);
    router.push('/login');
  }

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}