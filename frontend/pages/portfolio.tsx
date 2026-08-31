import { GetStaticProps } from 'next';
import { useMemo, useState } from 'react';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { HeroBand } from '@/components/layout/HeroBand';
import { PortfolioCard } from '@/components/sections/PortfolioCard';
import { Testimonials } from '@/components/sections/Testimonials';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig, cn } from '@/lib/utils';
import type { PortfolioItem, Testimonial } from '@/types';
import { ArrowRight, LayoutGrid } from 'lucide-react';

interface Props {
  items: PortfolioItem[];
  testimonials: Testimonial[];
}

export default function PortfolioPage({ items, testimonials }: Props) {
  const allTech = useMemo(
    () => Array.from(new Set(items.flatMap((i) => i.technologies))).sort(),
    [items]
  );
  const [filter, setFilter] = useState<string>('All');
  const filtered = filter === 'All' ? items : items.filter((i) => i.technologies.includes(filter));

  return (
    <>
      <Seo
        title="Portfolio"
        description="Selected work from Vision Giants — web, mobile, and custom software projects delivered for clients across industries."
        path="/portfolio"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Portfolio', url: `${siteConfig.url}/portfolio` },
        ]}
      />

      <HeroBand
        eyebrow="Our Work"
        title="Case studies, not just screenshots"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]}
        icon={LayoutGrid}
      />

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="max-w-xl">
          <p className="text-body/70">
            Every project below shipped to real users — we show the problem and the result,
            not just the pretty screens.
          </p>
        </Reveal>

        {allTech.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {['All', ...allTech].map((tech) => (
              <button
                key={tech}
                onClick={() => setFilter(tech)}
                className={cn(
                  'rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors',
                  filter === tech
                    ? 'chrome-shimmer border-transparent text-white'
                    : 'border-tertiary/40 text-body/70 hover:border-primary/40 hover:text-primary'
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="mt-16 text-body/50">No projects match that filter yet.</p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {filtered.map((item) => (
              <PortfolioCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-tertiary/30 bg-primary-container/20">
        <div className="mx-auto max-w-container px-6 py-20">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-semibold text-primary md:text-4xl">
              What clients say after launch
            </h2>
          </Reveal>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="rounded-3xl border border-tertiary/40 bg-primary-container/30 p-10 text-center md:p-14">
          <h2 className="font-display text-2xl font-semibold text-primary md:text-3xl">
            Want results like this for your product?
          </h2>
          <Button href="/contact" size="lg" className="mt-6">
            Start a Project <ArrowRight size={16} />
          </Button>
        </Reveal>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const [items, testimonials] = await Promise.all([api.getPortfolio(), api.getTestimonials()]);
    return { props: { items, testimonials }, revalidate: 3600 };
  } catch {
    return { props: { items: [], testimonials: [] }, revalidate: 60 };
  }
};