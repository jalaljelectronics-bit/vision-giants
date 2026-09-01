import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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

// How long each service holds the spotlight before advancing.
const ROTATE_MS = 4000;

interface HeroProps {
  services: Service[];
}

export function Hero({ services }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const [index, setIndex] = useState(0);
  const active = services[index];

  // setTimeout (not setInterval) rescheduled on every index change, so a
  // manual tab click (if reintroduced later) restarts the hold time.
  useEffect(() => {
    if (reduceMotion || services.length <= 1) return;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % services.length);
    }, ROTATE_MS);
    return () => clearTimeout(id);
  }, [index, services.length, reduceMotion]);

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

            {/* Synced with the spotlight card on the right: same index,
                same crossfade duration, so the service name here changes
                in lockstep with the card instead of independently.
                `grid-area 1/1` stacking (same trick as the card below)
                keeps this block's height constant even when service
                titles are different lengths, so nothing around it jumps. */}
            {active && (
              <motion.div variants={fadeUp} className="mt-5 grid">
                <AnimatePresence initial={false}>
                  {services.map((service, i) =>
                    i === index ? (
                      <motion.div
                        key={service.slug}
                        style={{ gridArea: '1 / 1' }}
                        initial={reduceMotion ? undefined : { opacity: 0 }}
                        animate={reduceMotion ? undefined : { opacity: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                      >
                        <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                          Our Services:
                        </p>
                        <p className="mt-1 font-display text-2xl font-semibold text-white md:text-3xl">
                          {service.title}
                        </p>
                      </motion.div>
                    ) : null
                  )}
                </AnimatePresence>
              </motion.div>
            )}

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

          {/* Service spotlight card stands in for the reference site's
              device mockup, auto-rotating through services on a timer.
              `display: grid` + every card pinned to grid-area 1/1 means
              the outgoing and incoming cards overlap in the SAME cell
              instead of stacking in normal flow — so the container's
              height stays constant and nothing else on the page shifts,
              no matter how many services get added later. */}
          {active && (
            <motion.div variants={fadeUp} className="hidden lg:grid">
              <AnimatePresence initial={false}>
                {services.map((service, i) =>
                  i === index ? (
                    <motion.div
                      key={service.slug}
                      style={{ gridArea: '1 / 1' }}
                      initial={reduceMotion ? undefined : { opacity: 0 }}
                      animate={reduceMotion ? undefined : { opacity: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE_PREMIUM }}
                    >
                      <Link
                        href={`/services/${service.slug}`}
                        className="sheen group block overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl shadow-primary/30"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-primary-container">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            priority
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                        <div className="p-8 md:p-10">
                          <h3 className="font-display text-xl font-semibold text-primary md:text-2xl">
                            {service.title}
                          </h3>
                          <p className="mt-3 text-sm text-body/70 md:text-base">
                            {service.short_description}
                          </p>
                          {service.sub_services?.length > 0 && (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {service.sub_services.slice(0, 3).map((sub) => (
                                <span
                                  key={sub.title}
                                  className="rounded-full bg-primary-container px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-primary"
                                >
                                  {sub.title}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-primary">
                            View details
                            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ) : null
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}