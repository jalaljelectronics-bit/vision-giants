import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2, Play } from 'lucide-react';
import { fadeUp, staggerContainer, EASE_PREMIUM } from '@/lib/motion';
import type { Service } from '@/types';

const CHECKLIST = [
  'Senior engineers on every project',
  'Fixed-scope, fixed-timeline delivery',
  'Direct access to your build team',
  'Code you fully own, day one',
];

// The three preview-card tones cycle by position (1st/2nd/3rd card),
// not by which service happens to be showing — so the row always reads
// as "dark / mid / light" regardless of which real services rotate through.
const CARD_TONES = [
  { box: 'chrome-shimmer', heading: 'text-white', body: 'text-white/80', meta: 'text-white/70' },
  { box: 'bg-secondary', heading: 'text-white', body: 'text-white/80', meta: 'text-white/70' },
  {
    box: 'bg-primary-container border border-tertiary/40',
    heading: 'text-primary',
    body: 'text-body/70',
    meta: 'text-primary/70',
  },
];

const ROTATE_MS = 3000;

interface HeroProps {
  services: Service[];
}

export function Hero({ services }: HeroProps) {
  const reduceMotion = useReducedMotion();

  // Split the real services into groups of 3, and cycle through the groups.
  const groups = useMemo(() => {
    const chunks: Service[][] = [];
    for (let i = 0; i < services.length; i += 3) {
      chunks.push(services.slice(i, i + 3));
    }
    return chunks;
  }, [services]);

  const [groupIndex, setGroupIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || groups.length <= 1) return;
    const id = setInterval(() => {
      setGroupIndex((i) => (i + 1) % groups.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [groups.length, reduceMotion]);

  const currentGroup = groups[groupIndex] ?? [];

  return (
    <section className="relative isolate overflow-hidden pb-28 md:pb-36">
      {/* Background video banner */}
      <div className="absolute inset-0 z-0">
        {reduceMotion ? (
          <img
            src="/videos/hero-bg-poster.jpg"
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
          />
        ) : (
          <video
            className="h-full w-full object-cover"
            src="/videos/hero-bg.mp4"
            poster="/videos/hero-bg-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-primary/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-container px-6 pt-32 md:pt-40"
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.1, 0.05)}
      >
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <motion.p
              variants={fadeUp}
              className="font-mono text-xs uppercase tracking-widest text-white/60"
            >
              Software Development Studio
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-xl font-display text-4xl font-semibold leading-tight text-white md:text-5xl"
            >
              Enterprise-grade software, built by a studio that ships.
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-lg text-base text-white/75 md:text-lg">
              Vision Giants partners with founders and product teams to design, build, and ship
              web, mobile, and custom software — from first sketch to production.
            </motion.p>

            <motion.ul variants={staggerContainer(0.06)} className="mt-8 grid gap-3 sm:grid-cols-2">
              {CHECKLIST.map((item) => (
                <motion.li key={item} variants={fadeUp} className="flex items-start gap-2.5 text-sm text-white/85">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-white" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg">
                Start a Project <ArrowRight size={16} />
              </Button>
              <Button
                href="/portfolio"
                variant="secondary"
                size="lg"
                className="!border-white/30 !bg-white/10 !text-white hover:!bg-white/20"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Play size={11} fill="currentColor" />
                </span>
                View Our Work
              </Button>
            </motion.div>
          </div>

          {/* Stat block standing in for the reference site's device mockup —
              kept in-palette rather than dropping in an unrelated photo. */}
          <motion.div
            variants={fadeUp}
            className="hidden rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-sm lg:block"
          >
            <dl className="grid grid-cols-2 gap-8">
              {[
                { label: 'Projects Shipped', value: '120+' },
                { label: 'Years Building', value: '8' },
                { label: 'Client Retention', value: '94%' },
                { label: 'Engineers on Team', value: '24' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="font-mono text-xs uppercase tracking-widest text-white/50">{stat.label}</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>

        {/* Real services, rotating 3-at-a-time */}
        {currentGroup.length > 0 && (
          <div className="relative z-10 mt-16 md:mt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={groupIndex}
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                className="grid gap-4 sm:grid-cols-3"
              >
                {currentGroup.map((service, i) => {
                  const tone = CARD_TONES[i % CARD_TONES.length];
                  return (
                    <a
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className={`sheen block rounded-2xl p-6 shadow-xl shadow-primary/20 transition-transform duration-300 hover:-translate-y-1 ${tone.box}`}
                    >
                      <h3 className={`font-display text-lg font-semibold ${tone.heading}`}>
                        {service.title}
                      </h3>
                      <p className={`mt-2 text-sm ${tone.body}`}>{service.short_description}</p>
                      <span
                        className={`mt-4 inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest ${tone.meta}`}
                      >
                        Learn more <ArrowRight size={12} />
                      </span>
                    </a>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {groups.length > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {groups.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Show services group ${i + 1}`}
                    onClick={() => setGroupIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === groupIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </section>
  );
}