import { GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { PortfolioCard } from '@/components/sections/PortfolioCard';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { PortfolioItem } from '@/types';

interface Props {
  items: PortfolioItem[];
}

export default function PortfolioPage({ items }: Props) {
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

      <section className="mx-auto max-w-container px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-body/50">Our Work</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold text-primary md:text-5xl">
          Products we've helped build
        </h1>
        <p className="mt-4 max-w-xl text-body/70">
          A selection of projects across web, mobile, and custom platforms — each one shipped
          in partnership with a real team solving a real problem.
        </p>

        {items.length === 0 ? (
          <p className="mt-16 text-body/50">No projects published yet — check back soon.</p>
        ) : (
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {items.map((item) => (
              <PortfolioCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const items = await api.getPortfolio();
    return { props: { items }, revalidate: 3600 };
  } catch {
    return { props: { items: [] }, revalidate: 60 };
  }
};