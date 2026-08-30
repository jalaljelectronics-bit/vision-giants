import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn, siteConfig } from '@/lib/utils';
import { EASE_PREMIUM } from '@/lib/motion';
import { api } from '@/lib/api';
import type { Service } from '@/types';

const NAV_LINKS = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
];

// Blue nav-link tones, all from the existing palette: `secondary` (#42527A)
// at rest, `primary` (#1B2A4A) on hover/active — no gray in between.
const linkBase =
  'rounded-full px-3 py-2 font-mono text-xs uppercase tracking-widest text-secondary transition-colors hover:bg-primary-container/50 hover:text-primary';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  // Header renders on every page and has no getStaticProps of its own,
  // so the dropdown's service list is fetched client-side once on mount.
  useEffect(() => {
    let cancelled = false;
    api
      .getServices()
      .then((data) => {
        if (!cancelled) setServices(data);
      })
      .catch(() => {
        // Leave the dropdown's service list empty if the API isn't reachable
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isServicesActive = router.pathname.startsWith('/services');

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      {/* Floating pill nav — a self-contained rounded bar with its own shadow
          and border, set off from the page instead of a full-width strip. */}
      <div className="mx-auto flex max-w-container items-center justify-between rounded-full border border-tertiary/40 bg-surface/90 px-5 py-2.5 shadow-lg shadow-primary/5 backdrop-blur-md">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight text-primary">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <Link
              href="/services"
              className={cn('flex items-center gap-1', linkBase, isServicesActive && 'text-primary')}
            >
              Services <ChevronDown size={12} />
            </Link>
            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 top-full w-64 pt-2"
                >
                  <div className="overflow-hidden rounded-2xl border border-tertiary/40 bg-surface p-2 shadow-xl shadow-primary/10">
                    {services.length === 0 ? (
                      <p className="px-3 py-2.5 text-sm text-secondary/60">Loading services…</p>
                    ) : (
                      services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          className="block rounded-xl px-3 py-2.5 text-sm text-secondary transition-colors hover:bg-primary-container/50 hover:text-primary"
                        >
                          {s.title}
                        </Link>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {NAV_LINKS.map((link) => {
            const active = router.pathname === link.href || router.pathname.startsWith(`${link.href}/`);
            return (
              <Link key={link.href} href={link.href} className={cn(linkBase, active && 'text-primary')}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="chrome-shimmer sheen hidden items-center gap-1.5 rounded-full px-5 py-2 font-mono text-xs uppercase tracking-widest text-white shadow-sm transition-opacity hover:opacity-90 md:inline-flex"
          >
            Contact
          </Link>

          <button
            aria-label="Toggle menu"
            className="p-2 text-primary md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_PREMIUM }}
            className="mx-auto mt-2 max-w-container overflow-hidden rounded-3xl border border-tertiary/40 bg-surface shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {[{ label: 'Services', href: '/services' }, ...NAV_LINKS].map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.25 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 font-mono text-sm uppercase tracking-widest text-secondary hover:bg-primary-container hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="chrome-shimmer mt-2 rounded-full px-5 py-3 text-center font-mono text-xs uppercase tracking-widest text-white"
              >
                Contact
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}