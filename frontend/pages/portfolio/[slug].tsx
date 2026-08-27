import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { PortfolioItem } from '@/types';
import { ArrowRight } from 'lucide-react';

interface Props {
  item: PortfolioItem;
}

export default function PortfolioDetailPage({ item }: Props) {
  return (
    <>
      <Seo
        title={item.title}
        description={item.description.slice(0, 155)}
        path={`/portfolio/${item.slug}`}
        image={item.images[0]}
        type="article"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Portfolio', url: `${siteConfig.url}/portfolio` },
          { name: item.title, url: `${siteConfig.url}/portfolio/${item.slug}` },
        ]}
      />

      <article className="mx-auto max-w-4xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-body/50">
          {item.client_name}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-primary md:text-5xl">
          {item.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-body/80">{item.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {item.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-primary-container px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-primary"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="chrome-rule my-10" />

        <div className="space-y-6">
          {item.images.map((img, i) => (
            <div key={img} className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-primary-container">
              <Image
                src={img}
                alt={`${item.title} — screenshot ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-tertiary/40 bg-primary-container/30 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Want a project like this one?
          </h2>
          <Button href="/contact" size="lg" className="mt-6">
            Start a Project <ArrowRight size={16} />
          </Button>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const items = await api.getPortfolio();
    return {
      paths: items.map((i) => ({ params: { slug: i.slug } })),
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const item = await api.getPortfolioItem(params!.slug as string);
    return { props: { item }, revalidate: 3600 };
  } catch {
    return { notFound: true };
  }
};