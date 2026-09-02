import { GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { HeroBand } from '@/components/layout/HeroBand';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { JobPosting } from '@/types';
import { ArrowRight, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

interface Props {
  jobs: JobPosting[];
}

export default function CareersPage({ jobs }: Props) {
  const openJobs = jobs.filter((j) => j.is_active);

  return (
    <>
      <Seo
        title="Careers"
        description="Join Vision Giants — we're hiring engineers and designers who care about craft and shipping real products."
        path="/careers"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Careers', url: `${siteConfig.url}/careers` },
        ]}
      />

      <HeroBand
        eyebrow="Careers"
        title="Build with people who care about the work"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Careers' }]}
        variant="careers"
      />

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="max-w-xl">
          <p className="text-body/70">
            We're a small studio by design. Every hire changes the shape of the team — so we're
            looking for people who want ownership, not just tickets.
          </p>
        </Reveal>

        {openJobs.length === 0 ? (
          <p className="mt-16 text-body/50">
            No open roles right now — check back soon, or reach out anyway.
          </p>
        ) : (
          <Reveal className="mt-14 divide-y divide-tertiary/30 border-y border-tertiary/30">
            {openJobs.map((job) => (
              <RevealItem key={job.slug}>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group flex flex-col gap-2 py-6 transition-colors hover:bg-primary-container/20 sm:flex-row sm:items-center sm:justify-between sm:px-4"
                >
                  <div>
                    <h2 className="font-display text-lg font-semibold text-primary">
                      {job.title}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-body/60">
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} /> {job.department}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} /> {job.location}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-wide">
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        )}
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const jobs = await api.getJobs();
    return { props: { jobs }, revalidate: 3600 };
  } catch {
    return { props: { jobs: [] }, revalidate: 60 };
  }
};