import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { fadeUp } from '@/lib/motion';

interface Crumb {
  label: string;
  href?: string;
}

interface HeroBandProps {
  eyebrow: string;
  title: string;
  crumbs: Crumb[];
  /** Large faint watermark icon that gives each page its own identity —
      Code2 for Services, Newspaper for Blog, etc. Picked per-page rather
      than using stock photography, so nothing depends on an external
      image host and every page stays in the same chrome/navy language. */
  icon: LucideIcon;
}

export function HeroBand({ eyebrow, title, crumbs, icon: Icon }: HeroBandProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      {/* Layered texture: two slow-drifting blurred color blobs (in your
          existing secondary/primary-container tones) plus a fine dot-grid
          overlay and a slow chrome sheen — no flat navy field. */}
      <div className="absolute inset-0 z-0" aria-hidden>
        <div className="animate-drift-a absolute -left-24 -top-32 h-96 w-96 rounded-full bg-secondary/50 blur-3xl" />
        <div className="animate-drift-b absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-primary-container/25 blur-3xl" />
        <div className="dot-grid absolute inset-0" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.12) 50%, transparent 70%)',
            backgroundSize: '220% 100%',
            animation: 'shimmer-sweep 8s ease-in-out infinite',
          }}
        />
        {/* Page-identifying icon watermark, bled off the right edge */}
        <Icon
          strokeWidth={1}
          className="absolute -right-10 top-1/2 hidden h-[22rem] w-[22rem] -translate-y-1/2 rotate-6 text-white/[0.07] md:block lg:h-[28rem] lg:w-[28rem]"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-0 h-px bg-white/10" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative z-10 mx-auto max-w-container px-6 pb-28 pt-32 md:pb-36 md:pt-40"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-white/50">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
          {title}
        </h1>
        <nav aria-label="Breadcrumb" className="mt-5 flex items-center gap-2 text-sm text-white/50">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </motion.div>
    </section>
  );
}