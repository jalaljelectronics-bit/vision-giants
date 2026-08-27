import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const STATS = [
  { label: 'Projects Shipped', value: '120+' },
  { label: 'Years Building', value: '8' },
  { label: 'Client Retention', value: '94%' },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,rgb(var(--color-primary-container))_0%,transparent_50%)]"
      />
      <div className="mx-auto max-w-container px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <p className="font-mono text-xs uppercase tracking-widest text-body/60">
          Software Development Studio
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-tight text-primary md:text-6xl">
          We build digital products for teams who move fast.
        </h1>
        <p className="mt-6 max-w-xl text-base text-body/80 md:text-lg">
          Vision Giants partners with founders and product teams to design, build, and ship
          web, mobile, and custom software — from first sketch to production.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button href="/contact" size="lg">
            Start a Project <ArrowRight size={16} />
          </Button>
          <Button href="/portfolio" variant="secondary" size="lg">
            View Our Work
          </Button>
        </div>

        <dl className="mt-16 grid grid-cols-3 gap-6 border-t border-tertiary/30 pt-8 md:max-w-lg">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-xs uppercase tracking-widest text-body/50">
                {stat.label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-primary md:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="chrome-rule" />
    </section>
  );
}