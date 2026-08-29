import Link from 'next/link';
import { siteConfig } from '@/lib/utils';

const FOOTER_COLUMNS = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Web Development', href: '/services/web-development' },
      { label: 'Mobile Apps', href: '/services/mobile-apps' },
      { label: 'Custom Software', href: '/services/custom-software' },
    ],
  },
  {
    title: 'Work',
    links: [
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-primary text-white">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <p className="font-display text-lg font-semibold text-white">{siteConfig.name}</p>
            <p className="mt-3 max-w-xs text-sm text-white/60">{siteConfig.description}</p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-widest text-white/40">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/75 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              LinkedIn
            </a>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}