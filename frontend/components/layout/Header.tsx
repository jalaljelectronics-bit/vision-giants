import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { cn, siteConfig } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 border-b border-tertiary/40 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-primary">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-mono text-xs uppercase tracking-widest text-body/70 transition-colors hover:text-primary',
                  active && 'text-primary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle color theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full p-2 text-body/70 transition-colors hover:bg-primary-container hover:text-primary"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            href="/contact"
            className="chrome-shimmer hidden rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest text-white shadow-sm transition-opacity hover:opacity-90 md:inline-block"
          >
            Start a Project
          </Link>

          <button
            aria-label="Toggle menu"
            className="p-2 text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="flex flex-col gap-1 border-t border-tertiary/40 bg-surface px-6 py-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-3 font-mono text-sm uppercase tracking-widest text-body/80 hover:bg-primary-container hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="chrome-shimmer mt-2 rounded-full px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-white"
          >
            Start a Project
          </Link>
        </nav>
      )}

      <div className="chrome-rule" />
    </header>
  );
}