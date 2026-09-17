import Link from 'next/link';
import { siteConfig } from '@/lib/utils';

const SERVICES = [
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'Game Development', href: '/services/game-development' },
  { label: 'Custom Software Development', href: '/services/custom-software-development' },
  { label: 'SEO', href: '/services/seo' },
  { label: 'App Development', href: '/services/app-development' },
  { label: 'Robotics', href: '/services/robotics' },
  { label: 'Social Media Marketing', href: '/services/social-media-marketing' },
  { label: 'Graphic Designing', href: '/services/graphic-designing' },
  { label: 'E-commerce', href: '/services/e-commerce' },
  { label: 'YouTube Automation', href: '/services/youtube-automation' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
];

const WORK_LINKS = [
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-primary text-white">
      <div className="mx-auto max-w-container px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="font-display text-lg font-semibold text-white">Vision Giants PTV LTD</p>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Engineering ambitious ideas into scalable software — from first sketch to global launch.
            </p>
          </div>

          {/* Services Column (single vertical column with all 10 services) */}
          <div className="col-span-1">
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">Services</p>
            <ul className="mt-4 space-y-2.5">
              {SERVICES.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-1">
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">Company</p>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work Column */}
          <div className="col-span-1">
            <p className="font-mono text-xs uppercase tracking-widest text-white/40">Work</p>
            <ul className="mt-4 space-y-2.5">
              {WORK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright and social links */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Vision Giants PTV LTD. All rights reserved.</p>
          <div className="flex gap-5">
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}