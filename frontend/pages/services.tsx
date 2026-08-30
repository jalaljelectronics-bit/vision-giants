import { GetStaticProps } from 'next';
import Image from 'next/image';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { HeroBand } from '@/components/layout/HeroBand';
import { Button } from '@/components/ui/Button';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { Service } from '@/types';
import { ArrowRight } from 'lucide-react';

interface Props {
  services: Service[];
}

export default function ServicesPage({ services }: Props) {
  return (
    <>
      <Seo
        title="Services"
        description="What Vision Giants builds — web, mobile, and custom software for teams that need a product partner, not just a vendor."
        path="/services"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Services', url: `${siteConfig.url}/services` },
        ]}
      />

      <HeroBand
        eyebrow="Services"
        title="What we build"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
      />

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="max-w-xl">
          <p className="text-body/70">
            From early-stage MVPs to production platforms — we work as an embedded product team,
            not a ticket queue.
          </p>
        </Reveal>

        {services.length === 0 ? (
          <p className="mt-16 text-body/50">Service listings coming soon.</p>
        ) : (
          <div className="mt-14 space-y-16">
            {services.map((service, i) => (
              <RevealItem key={service.slug}>
                <div
                  className={`grid items-center gap-10 md:grid-cols-2 ${
                    i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-container">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-primary/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="mt-2 font-display text-2xl font-semibold text-primary md:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-4 text-body/70">{service.short_description}</p>
                    <Button href={`/services/${service.slug}`} variant="secondary" className="mt-6">
                      View details <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </RevealItem>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const services = await api.getServices();
    return { props: { services }, revalidate: 3600 };
  } catch {
    return { props: { services: [] }, revalidate: 60 };
  }
};