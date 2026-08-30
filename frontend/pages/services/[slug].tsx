import { GetStaticPaths, GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
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

      <article className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-body/50">Service</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-primary md:text-5xl">
          {service.title}
        </h1>
        <p className="mt-6 text-lg text-body/80">{service.short_description}</p>

        <div className="chrome-rule my-10" />

        <div
          className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-primary"
          dangerouslySetInnerHTML={{ __html: service.description }}
        />

        {service.sub_services && service.sub_services.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-primary">
              What's included
            </h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {service.sub_services.map((sub, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-tertiary/40 bg-surface p-6"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-primary"
                    />
                    <div>
                      <h3 className="font-display text-base font-semibold text-primary">
                        {sub.title}
                      </h3>
                      <p className="mt-2 text-sm text-body/70">
                        {sub.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-14 rounded-2xl border border-tertiary/40 bg-primary-container/30 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Ready to talk through your project?
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