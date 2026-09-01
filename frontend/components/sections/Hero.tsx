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
const FADE_S = 0.6;

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

            {/* Synced with the spotlight card: same `active`, same fade
                duration. Fixed height (not auto) so a long service name
                never pushes the paragraph below it up or down. */}
            {active && (
              <div className="relative mt-5 h-[64px] md:h-[72px]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.slug}
                    className="absolute inset-0"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: FADE_S, ease: EASE_PREMIUM }}
                  >
                    <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                      Our Services:
                    </p>
                    <p className="mt-1 truncate font-display text-2xl font-semibold text-white md:text-3xl">
                      {active.title}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
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

          {/* Service spotlight card — genuinely fixed-size, not just
              layout-smoothed: the image is a fixed aspect-ratio (scales
              with column width, but identically for every service at any
              given viewport), and the text block below it is a FIXED
              pixel height with overflow-hidden + line-clamp, so a long
              description or an extra sub-service chip can never make one
              service's card taller than another's — it just gets clipped
              instead of pushing the box's size around. */}
          {active && (
            <motion.div variants={fadeUp} className="relative hidden lg:block">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.slug}
                  className="absolute inset-0"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: FADE_S, ease: EASE_PREMIUM }}
                >
                  <Link
                    href={`/services/${active.slug}`}
                    className="sheen group block overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl shadow-primary/30"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-primary-container">
                      <Image
                        src={active.image}
                        alt={active.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    {/* Fixed height + overflow-hidden — the box that must
                        never resize between services. */}
                    <div className="flex h-[230px] flex-col p-8 md:p-10">
                      <h3 className="font-display text-xl font-semibold text-primary md:text-2xl">
                        {active.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm text-body/70 md:text-base">
                        {active.short_description}
                      </p>
                      {active.sub_services?.length > 0 && (
                        <div className="mt-4 flex max-h-[34px] flex-wrap gap-2 overflow-hidden">
                          {active.sub_services.slice(0, 3).map((sub) => (
                            <span
                              key={sub.title}
                              className="rounded-full bg-primary-container px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-primary"
                            >
                              {sub.title}
                            </span>
                          ))}
                        </div>
                      )}
                      <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 font-mono text-xs uppercase tracking-widest text-primary">
                        View details
                        <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
              {/* Invisible sizer — absolutely positioned siblings above
                  don't contribute to this container's height, so a hidden
                  identical structure reserves the real, constant space. */}
              <div aria-hidden className="invisible">
                <div className="overflow-hidden rounded-3xl border border-transparent">
                  <div className="aspect-[16/9]" />
                  <div className="h-[230px] p-8 md:p-10" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}