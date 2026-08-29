import { Seo } from '@/components/seo/Seo';
import { Hero } from '@/components/sections/Hero';
import { Testimonials } from '@/components/sections/Testimonials';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { siteConfig } from '@/lib/utils';
import { mockTestimonials } from '@/lib/mockData';
import { Target, Eye, Heart, ArrowRight } from 'lucide-react';

const VALUES = [
  {
    icon: Target,
    title: 'Ship what matters',
    body: 'We scope ruthlessly around the features that move the metric you actually care about.',
  },
  {
    icon: Eye,
    title: 'No black boxes',
    body: "Clear documentation and clean code, so your next hire isn't stuck reverse-engineering our decisions.",
  },
  {
    icon: Heart,
    title: 'Own the outcome',
    body: 'We treat every client project like it has to survive contact with real users — because it does.',
  },
];

export default function HomePage() {
  return (
    <>
      <Seo
        title="Software Development Studio"
        description={siteConfig.description}
        path="/"
      />

      <Hero />

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest text-body/50">
            Why Teams Choose Us
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
            A studio that thinks like a co-founder, not a vendor
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <RevealItem key={v.title}>
              <Card className="h-full">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-primary">
                  <v.icon size={20} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-primary">{v.title}</h3>
                <p className="mt-3 text-sm text-body/70">{v.body}</p>
              </Card>
            </RevealItem>
          ))}
        </div>
      </section>

      <section className="border-y border-tertiary/30 bg-primary-container/20">
        <div className="mx-auto max-w-container px-6 py-20">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-body/50">
                What Clients Say
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
                What clients say after launch
              </h2>
            </div>
          </Reveal>
          <Testimonials testimonials={mockTestimonials} />
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-body/70">
            Tell us what you're building — we'll get back to you within one business day.
          </p>
          <Button href="/contact" size="lg" className="mt-8">
            Start a Project <ArrowRight size={16} />
          </Button>
        </Reveal>
      </section>
    </>
  );
}