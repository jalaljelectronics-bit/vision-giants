import { Seo } from '@/components/seo/Seo';
import { Hero } from '@/components/sections/Hero';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const SERVICES_PREVIEW = [
  { title: 'Web Development', slug: 'web-development', blurb: 'Fast, accessible, SEO-first web apps built on modern frameworks.' },
  { title: 'Mobile Apps', slug: 'mobile-apps', blurb: 'Native-feel iOS and Android apps from a single codebase.' },
  { title: 'Custom Software', slug: 'custom-software', blurb: 'Bespoke internal tools and platforms tailored to your workflow.' },
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
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-body/50">
              What We Do
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
              Services built around outcomes
            </h2>
          </div>
          <Button href="/services" variant="ghost" size="sm" className="hidden md:inline-flex">
            All Services <ArrowRight size={14} />
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SERVICES_PREVIEW.map((s) => (
            <Card key={s.slug}>
              <h3 className="font-display text-xl font-semibold text-primary">{s.title}</h3>
              <p className="mt-3 text-sm text-body/70">{s.blurb}</p>
              <Button href={`/services/${s.slug}`} variant="ghost" size="sm" className="mt-6 px-0">
                Learn more <ArrowRight size={14} />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-tertiary/30 bg-primary-container/30">
        <div className="mx-auto max-w-container px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-body/70">
            Tell us what you're building — we'll get back to you within one business day.
          </p>
          <Button href="/contact" size="lg" className="mt-8">
            Start a Project <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </>
  );
}