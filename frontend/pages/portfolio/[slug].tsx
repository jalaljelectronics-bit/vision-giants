import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { PortfolioItem } from '@/types';
import { ArrowRight, ExternalLink, Target, Wrench, TrendingUp } from 'lucide-react';

interface Props {
  item: PortfolioItem;
}

export default function PortfolioDetailPage({ item }: Props) {
  const sections = [
    { icon: Target, label: 'The Challenge', body: item.challenge },
    { icon: Wrench, label: 'The Solution', body: item.solution },
    { icon: TrendingUp, label: 'The Result', body: item.result },
  ];

  return (
    <>
      <Seo
        title={item.title}
        description={item.result.slice(0, 155)}
        path={`/portfolio/${item.slug}`}
        image={item.cover_image}
        type="article"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Portfolio', url: `${siteConfig.url}/portfolio` },
          { name: item.title, url: `${siteConfig.url}/portfolio/${item.slug}` },
        ]}
      />

      {/* pt-32/md:pt-40 clears the fixed floating header, which no longer
          reserves its own space in normal document flow. */}
      <article className="mx-auto max-w-4xl px-6 pb-20 pt-32 md:pt-40">
        <Reveal>
          <h1 className="font-display text-4xl font-semibold text-primary md:text-5xl">
            {item.title}
          </h1>

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
        </Reveal>

        <Reveal
          className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-primary-container"
        >
          <Image
            src={item.cover_image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
          />
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {sections.map((s) => (
            <Reveal key={s.label}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-primary">
                <s.icon size={20} />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-primary">{s.label}</h2>
              <p className="mt-3 text-sm text-body/70">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 rounded-2xl border border-tertiary/40 bg-primary-container/30 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Want a project like this one?
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" size="lg">
              Start a Project <ArrowRight size={16} />
            </Button>
            <Button
              href={item.project_url}
              size="lg"
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit live site <ExternalLink size={16} />
            </Button>
          </div>
        </Reveal>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const items = await api.getPortfolio();
    return {
      paths: items.filter((i) => !i.is_draft).map((i) => ({ params: { slug: i.slug } })),
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const item = await api.getPortfolioItem(params!.slug as string);
    if (item.is_draft) return { notFound: true };
    return { props: { item }, revalidate: 3600 };
  } catch {
    return { notFound: true };
  }
};