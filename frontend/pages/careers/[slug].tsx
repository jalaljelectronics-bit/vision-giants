import { GetStaticPaths, GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';
import { BreadcrumbJsonLd, JobPostingJsonLd } from '@/components/seo/JsonLd';
import { api } from '@/lib/api';
import { siteConfig, formatDate } from '@/lib/utils';
import type { JobPosting } from '@/types';
import { ArrowRight, MapPin, Briefcase, Clock } from 'lucide-react';

interface Props {
  job: JobPosting;
}

export default function CareerDetailPage({ job }: Props) {
  const url = `${siteConfig.url}/careers/${job.slug}`;

  return (
    <>
      <Seo
        title={job.title}
        description={job.description.slice(0, 155)}
        path={`/careers/${job.slug}`}
        type="article"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Careers', url: `${siteConfig.url}/careers` },
          { name: job.title, url },
        ]}
      />
      <JobPostingJsonLd
        title={job.title}
        description={job.description}
        datePosted={job.created_at}
        department={job.department}
        location={job.location}
        employmentType={job.type}
        url={url}
      />

      {/* pt-32/md:pt-40 clears the fixed floating header, which no longer
          reserves its own space in normal document flow. */}
      <article className="mx-auto max-w-3xl px-6 pb-20 pt-32 md:pt-40">
        <p className="font-mono text-xs uppercase tracking-widest text-body/50">
          {job.department}
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-primary md:text-5xl">
          {job.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-body/70">
          <span className="flex items-center gap-1.5">
            <MapPin size={16} /> {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase size={16} /> {job.type}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} /> Posted {formatDate(job.created_at)}
          </span>
        </div>

        <div className="chrome-rule my-10" />

        <div
          className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />

        {job.requirements && (
          <>
            <h2 className="mt-10 font-display text-xl font-semibold text-primary">
              Requirements
            </h2>
            <div
              className="prose prose-slate mt-4 max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: job.requirements }}
            />
          </>
        )}

        <div className="mt-14 rounded-2xl border border-tertiary/40 bg-primary-container/30 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Interested in this role?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-body/70">
            Send us your background and a bit about why this role's a fit.
          </p>
          <Button href={`/contact?role=${job.slug}`} size="lg" className="mt-6">
            Apply Now <ArrowRight size={16} />
          </Button>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const jobs = await api.getJobs();
    return {
      paths: jobs.filter((j) => j.is_active).map((j) => ({ params: { slug: j.slug } })),
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const job = await api.getJob(params!.slug as string);
    return { props: { job }, revalidate: 3600 };
  } catch {
    return { notFound: true };
  }
};