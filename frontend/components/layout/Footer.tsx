import Link from 'next/link';
import { siteConfig } from '@/lib/utils';

const DEVELOPMENT_SERVICES = [
  { label: 'Web Development', href: '/services/web-development' },
  { label: 'App Development', href: '/services/app-development' },
  { label: 'Custom Software', href: '/services/custom-software-development' },
  { label: 'Game Development', href: '/services/game-development' },
  { label: 'Robotics', href: '/services/robotics' },
];

const GROWTH_DESIGN_SERVICES = [
  { label: 'SEO', href: '/services/seo' },
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
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="font-display text-lg font-semibold text-white">Vision Giants PTV LTD</p>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Engineering ambitious ideas into scalable software — from first sketch to global launch.
            </p>
          </div>

          {/* Services Section with 2 Grouped Sub-columns */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="w-fit">
              <p className="text-center font-mono text-xs uppercase tracking-widest text-white/40">Services</p>

              <div className="mt-4 grid grid-cols-2 gap-6 sm:gap-8">
                {/* Development Sub-column */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Development
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {DEVELOPMENT_SERVICES.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth & Design Sub-column */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Growth &amp; Design
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {GROWTH_DESIGN_SERVICES.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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