import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { fadeUp, staggerContainer, EASE_PREMIUM } from '@/lib/motion';

const STATS = [
  { label: 'Projects Shipped', value: '120+' },
  { label: 'Years Building', value: '8' },
  { label: 'Client Retention', value: '94%' },
];

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,rgb(var(--color-primary-container))_0%,transparent_50%)]"
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_PREMIUM }}
      />

      <motion.div
        className="mx-auto max-w-container px-6 pb-20 pt-24 md:pb-28 md:pt-32"
        initial="hidden"
        animate="show"
        variants={staggerContainer(0.12, 0.05)}
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-xs uppercase tracking-widest text-body/60"
        >
          Software Development Studio
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-primary md:text-6xl"
        >
          We build digital products for teams who move fast.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-xl text-base text-body/80 md:text-lg"
        >
          Vision Giants partners with founders and product teams to design, build, and ship
          web, mobile, and custom software — from first sketch to production.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact" size="lg">
            Start a Project <ArrowRight size={16} />
          </Button>
          <Button href="/portfolio" variant="secondary" size="lg">
            View Our Work
          </Button>
        </motion.div>

        <motion.dl
          variants={staggerContainer(0.08)}
          className="mt-16 grid grid-cols-3 gap-6 border-t border-tertiary/30 pt-8 md:max-w-lg"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <dt className="font-mono text-xs uppercase tracking-widest text-body/50">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-primary md:text-3xl">
                {stat.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
      <div className="chrome-rule" />
    </section>
  );
}