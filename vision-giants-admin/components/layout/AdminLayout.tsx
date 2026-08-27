// components/layout/AdminLayout.tsx
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { admin, isLoading } = useAdminAuth();
  const router = useRouter();

  // Middleware already redirects unauthenticated requests to /login,
  // but this covers the brief client-side window before that resolves
  // (e.g. on first hydration) so we don't flash protected content.
  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <p>Loading…</p>
      </div>
    );
  }

  if (!admin) {
    // Belt-and-suspenders: if somehow rendered without a session,
    // don't render the dashboard shell at all.
    router.replace('/login');
    return null;
  }

  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <Topbar admin={admin} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}