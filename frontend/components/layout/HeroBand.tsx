import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer, EASE_PREMIUM } from '@/lib/motion';

interface Crumb {
  label: string;
  href?: string;
}

export type BandVariant = 'services' | 'portfolio' | 'about' | 'blog' | 'careers';

interface HeroBandProps {
  eyebrow: string;
  title: string;
  crumbs: Crumb[];
  variant: BandVariant;
}

// Fixed, hand-placed positions — deterministic on purpose. Math.random()
// here would render different dots on the server vs. the client and throw
// a hydration mismatch; a plain array keeps server and client identical.
const PARTICLES = [
  { top: '20%', left: '8%', size: 2, delay: 0, duration: 6 },
  { top: '70%', left: '14%', size: 2, delay: 1.4, duration: 7.5 },
  { top: '35%', left: '30%', size: 2, delay: 0.7, duration: 5.5 },
  { top: '15%', left: '46%', size: 2, delay: 2.1, duration: 8 },
];

const ACCENT = '#DDE4F2'; // primary-container, hardcoded for SVG stroke use

// Hand-built geometric line-art, unique per page — deliberately not a
// stock icon blown up large and faded. Plain strokes only, one accent
// line/dot per piece for a point of color.
const ARTWORK: Record<BandVariant, JSX.Element> = {
  services: (
    <svg viewBox="0 0 320 320" fill="none" className="h-full w-full">
      <path d="M118 88 L64 160 L118 232" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M202 88 L256 160 L202 232" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="178" y1="76" x2="142" y2="244" stroke={ACCENT} strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="64" cy="160" r="3" fill="white" fillOpacity="0.45" />
      <circle cx="256" cy="160" r="3" fill="white" fillOpacity="0.45" />
    </svg>
  ),
  portfolio: (
    <svg viewBox="0 0 320 320" fill="none" className="h-full w-full">
      <rect x="66" y="128" width="150" height="104" rx="12" stroke="white" strokeOpacity="0.22" strokeWidth="2" transform="rotate(-9 141 180)" />
      <rect x="88" y="116" width="150" height="104" rx="12" stroke="white" strokeOpacity="0.3" strokeWidth="2" transform="rotate(-2 163 168)" />
      <rect x="108" y="104" width="150" height="104" rx="12" stroke={ACCENT} strokeOpacity="0.75" strokeWidth="2" transform="rotate(5 183 156)" />
      <circle cx="128" cy="122" r="3" fill={ACCENT} />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 320 320" fill="none" className="h-full w-full">
      <circle cx="118" cy="132" r="44" stroke="white" strokeOpacity="0.28" strokeWidth="2" />
      <circle cx="200" cy="108" r="32" stroke="white" strokeOpacity="0.22" strokeWidth="2" />
      <circle cx="178" cy="204" r="56" stroke={ACCENT} strokeOpacity="0.55" strokeWidth="2" />
      <line x1="118" y1="132" x2="200" y2="108" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <line x1="118" y1="132" x2="178" y2="204" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <line x1="200" y1="108" x2="178" y2="204" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
      <circle cx="178" cy="204" r="3" fill={ACCENT} />
    </svg>
  ),
  blog: (
    <svg viewBox="0 0 320 320" fill="none" className="h-full w-full">
      <line x1="66" y1="112" x2="216" y2="112" stroke="white" strokeOpacity="0.28" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="142" x2="240" y2="142" stroke="white" strokeOpacity="0.28" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="66" y1="172" x2="186" y2="172" stroke="white" strokeOpacity="0.28" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M96 206 L228 88" stroke={ACCENT} strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="228" cy="88" r="4" fill={ACCENT} />
    </svg>
  ),
  careers: (
    <svg viewBox="0 0 320 320" fill="none" className="h-full w-full">
      <path d="M60 232 L118 192 L156 212 L206 132 L250 92" stroke="white" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M232 92 L250 92 L250 110" stroke={ACCENT} strokeOpacity="0.75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="232" r="3" fill="white" fillOpacity="0.4" />
      <circle cx="250" cy="92" r="4" fill={ACCENT} />
    </svg>
  ),
};

const PAGE_NUMBER: Record<BandVariant, string> = {
  services: '01',
  portfolio: '02',
  about: '03',
  blog: '04',
  careers: '05',
};

export function HeroBand({ eyebrow, title, crumbs, variant }: HeroBandProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0" aria-hidden>
        {/* Fine blueprint grid — a technical, intentional texture instead
            of a soft gradient-blob field. */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        {/* Large ghost page-number — an editorial device, not an icon */}
        <span
          aria-hidden
          className="absolute -right-4 -top-8 select-none font-display text-[16rem] font-bold leading-none text-transparent md:text-[20rem]"
          style={{ WebkitTextStroke: '1.5px rgb(255 255 255 / 0.06)' }}
        >
          {PAGE_NUMBER[variant]}
        </span>

        {/* Per-page geometric line-art */}
        <div className="absolute -right-4 top-1/2 hidden h-72 w-72 -translate-y-1/2 md:block lg:h-[26rem] lg:w-[26rem]">
          {ARTWORK[variant]}
        </div>

        {/* A handful of drifting light particles for quiet motion */}
        {!reduceMotion &&
          PARTICLES.map((p, i) => (
            <span
              key={i}
              className="particle absolute rounded-full bg-white/40"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-0 h-px bg-white/10" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.12, 0.05)}
        className="relative z-10 mx-auto max-w-container px-6 pb-28 pt-32 md:pb-36 md:pt-40"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <span className="h-4 w-[3px] bg-primary-container" />
          <p className="font-mono text-xs uppercase tracking-widest text-white/60">{eyebrow}</p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { scaleX: 0 }}
          animate={reduceMotion ? undefined : { scaleX: 1 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.15 }}
          style={{ transformOrigin: 'left' }}
          className="mt-4 h-px w-16 bg-white/30"
        />

        {/* Kinetic title reveal: a clip-path wipe rather than a plain fade,
            so the headline draws itself in left-to-right. */}
        <motion.h1
          initial={reduceMotion ? undefined : { clipPath: 'inset(0 100% 0 0)' }}
          animate={reduceMotion ? undefined : { clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 0.25 }}
          className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.nav
          variants={fadeUp}
          aria-label="Breadcrumb"
          className="mt-5 flex items-center gap-2 text-sm text-white/50"
        >
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
        </motion.nav>
      </motion.div>
    </section>
  );
}