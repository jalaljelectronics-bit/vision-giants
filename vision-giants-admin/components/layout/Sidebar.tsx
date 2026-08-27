// components/layout/Sidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'Team', href: '/team' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Jobs', href: '/jobs' },
  { label: 'Applications', href: '/applications' },
  { label: 'Leads', href: '/leads' },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">Vision Giants</div>

      <nav className="admin-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/'
              ? router.pathname === '/'
              : router.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}