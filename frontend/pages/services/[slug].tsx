import Image from 'next/image';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { HeroBand } from '@/components/layout/HeroBand';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { Service } from '@/types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  service: Service;
}

export default function ServiceDetailPage({ service }: Props) {
  return (
    <>
      <Seo
        title={service.title}
        description={service.short_description}
        path={`/services/${service.slug}`}
        image={service.image}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Services', url: `${siteConfig.url}/services` },
          { name: service.title, url: `${siteConfig.url}/services/${service.slug}` },
        ]}
      />

      <HeroBand
        eyebrow="Service"
        title={service.title}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.title },
        ]}
      />

      <article className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <p className="text-lg text-body/80">{service.short_description}</p>
        </Reveal>

        {service.image && (
          <Reveal className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-primary-container">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </Reveal>
        )}

        <Reveal className="prose prose-slate mt-10 max-w-none prose-headings:font-display prose-headings:text-primary">
          <div dangerouslySetInnerHTML={{ __html: service.description }} />
        </Reveal>

        {service.sub_services && service.sub_services.length > 0 && (
          <div className="mt-14">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-primary">What's included</h2>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.sub_services.map((sub) => (
                <RevealItem key={sub.title}>
                  <div className="h-full rounded-2xl border border-tertiary/40 bg-primary-container/20 p-6">
                    <CheckCircle2 size={20} className="text-primary" />
                    <h3 className="mt-4 font-display font-semibold text-primary">{sub.title}</h3>
                    <p className="mt-2 text-sm font-medium text-body/80">{sub.description}</p>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        )}

        <Reveal className="mt-14 rounded-2xl border border-tertiary/40 bg-primary-container/30 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Ready to talk through your project?
          </h2>
          <Button href="/contact" size="lg" className="mt-6">
            Start a Project <ArrowRight size={16} />
          </Button>
        </Reveal>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const services = await api.getServices();
    return {
      paths: services.map((s) => ({ params: { slug: s.slug } })),
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const service = await api.getService(params!.slug as string);
    return { props: { service }, revalidate: 3600 };
  } catch {
    return { notFound: true };
  }
};