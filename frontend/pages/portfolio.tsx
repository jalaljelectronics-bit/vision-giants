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
import { siteConfig, cn, getHostname } from '@/lib/utils';
import type { PortfolioItem, Testimonial } from '@/types';
import { ArrowRight } from 'lucide-react';

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
        variant="portfolio"
      />

      {/* Client pill strip — jumps to that project's card below. Inlined
          here rather than a separate component since it's only used on
          this one page. Not the same as PortfolioMarquee (home page):
          this one doesn't auto-scroll or duplicate items, since clicking
          a pill to jump somewhere doesn't mix well with content also
          sliding around on its own. */}
      {items.length > 0 && (
        <div className="border-y border-tertiary/30 bg-primary-container/10 py-5">
          <div className="scrollbar-none flex gap-3 overflow-x-auto px-6" style={{ scrollbarWidth: 'none' }}>
            {items.map((item) => (
              <button
                key={item.slug}
                onClick={() => {
                  setFilter('All');
                  requestAnimationFrame(() => {
                    document.getElementById(`portfolio-${item.slug}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    });
                  });
                }}
                className="group relative flex shrink-0 items-center gap-2.5 rounded-full border border-tertiary/40 bg-surface px-4 py-2 transition-colors hover:border-primary"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container font-mono text-[11px] font-semibold text-primary">
                  {item.title.charAt(0).toUpperCase()}
                </span>
                <span className="whitespace-nowrap font-mono text-xs uppercase tracking-wide text-body/70 group-hover:text-primary">
                  {item.title}
                </span>
                {getHostname(item.project_url) && (
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-tertiary/40 bg-surface px-3 py-1.5 text-xs text-primary opacity-0 shadow-lg shadow-primary/10 transition-opacity group-hover:opacity-100">
                    {getHostname(item.project_url)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

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
              <PortfolioCard key={item.slug} item={item} id={`portfolio-${item.slug}`} />
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