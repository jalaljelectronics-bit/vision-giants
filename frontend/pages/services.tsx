import { GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { Service } from '@/types';

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

      <section className="mx-auto max-w-container px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-body/50">Services</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold text-primary md:text-5xl">
          What we build
        </h1>
        <p className="mt-4 max-w-xl text-body/70">
          From early-stage MVPs to production platforms — we work as an embedded product team,
          not a ticket queue.
        </p>

        {services.length === 0 ? (
          <p className="mt-16 text-body/50">Service listings coming soon.</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
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