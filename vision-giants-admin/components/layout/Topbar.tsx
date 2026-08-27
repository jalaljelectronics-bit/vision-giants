// components/layout/Topbar.tsx
import { useTheme } from 'next-themes';
import type { Admin } from '@/types';
import { useAdminAuth } from '@/lib/AdminAuthContext';

interface TopbarProps {
  admin: Admin;
}

export default function Topbar({ admin }: TopbarProps) {
  const { logout } = useAdminAuth();
  const { theme, setTheme } = useTheme();

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-spacer" />

      <div className="admin-topbar-actions">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="admin-icon-button"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <span className="admin-topbar-name">{admin.name}</span>

        <button type="button" onClick={logout} className="admin-logout-button">
          Log out
        </button>
      </div>
    </header>
  );
}