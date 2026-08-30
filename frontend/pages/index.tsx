import { GetStaticProps } from 'next';
import Image from 'next/image';
import { Seo } from '@/components/seo/Seo';
import { Hero } from '@/components/sections/Hero';
import { Testimonials } from '@/components/sections/Testimonials';
import { PortfolioCard } from '@/components/sections/PortfolioCard';
import { ServiceCard } from '@/components/sections/ServiceCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { Testimonial, PortfolioItem, Service } from '@/types';
import { Target, Eye, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Props {
  testimonials: Testimonial[];
  featuredPortfolio: PortfolioItem[];
  services: Service[];
}

const CEO_PHOTO =
  'https://res.cloudinary.com/r2fk1fws/image/upload/v1788086840/image_jbkknj.png';

const INTRO_CHECKLIST = [
  'Cutting-edge technology products',
  'Strategic partnerships for enhanced capabilities',
  'Commitment to quality and reliability',
  'Proven track record of success',
];

const VALUES = [
  {
    icon: Target,
    title: 'Ship what matters',
    body: 'We scope ruthlessly around the features that move the metric you actually care about.',
  },
  {
    icon: Eye,
    title: 'No black boxes',
    body: "Clear documentation and clean code, so your next hire isn't stuck reverse-engineering our decisions.",
  },
  {
    icon: Heart,
    title: 'Own the outcome',
    body: 'We treat every client project like it has to survive contact with real users — because it does.',
  },
];

export default function HomePage({ testimonials, featuredPortfolio, services }: Props) {
  return (
    <>
      <Seo
        title="Software Development Studio"
        description={siteConfig.description}
        path="/"
      />

      <Hero />

      {/* CEO intro block */}
      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-primary md:text-4xl">
              Where innovation thrives with the best IT services
            </h2>
            <p className="mt-6 text-body/70">
              At <strong className="text-primary">{siteConfig.name}</strong>, we are more than a
              technology company — we are a trusted{' '}
              <strong className="text-primary">software development</strong> and{' '}
              <strong className="text-primary">IT services</strong> partner committed to driving
              digital transformation. Our mission is to deliver intelligent, scalable, and
              future-ready solutions that empower businesses to grow, innovate, and succeed.
            </p>
            <p className="mt-4 text-body/70">
              With a team of skilled engineers, we offer comprehensive{' '}
              <strong className="text-primary">software development</strong>,{' '}
              <strong className="text-primary">web &amp; mobile development</strong>, and{' '}
              <strong className="text-primary">custom business tools</strong> — every solution
              built on a deep understanding of your goals and challenges.
            </p>

            <ul className="mt-8 space-y-3">
              {INTRO_CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-body/80">
                  <CheckCircle2 size={18} className="shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg">
                Get Started <ArrowRight size={16} />
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                Our Services
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src="/videos/hero-bg-poster.jpg"
                alt="The Vision Giants team at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* CEO quote chip, overlapping the bottom of the photo */}
            <div className="absolute inset-x-4 -bottom-8 flex items-start gap-4 rounded-2xl chrome-shimmer p-6 shadow-xl shadow-primary/20 md:inset-x-8">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/40">
                <Image src={CEO_PHOTO} alt="Jalal Khan" fill className="object-cover" sizes="48px" />
              </div>
              <p className="text-sm text-white/90">
                As CEO, <strong className="text-white">Jalal Khan</strong> leads{' '}
                {siteConfig.name} with a passion for innovation, combining technology, creativity,
                and strategy to build meaningful digital experiences that help businesses thrive.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Recent launch / featured portfolio */}
      {featuredPortfolio.length > 0 && (
        <section className="mt-16 border-y border-tertiary/30 bg-primary-container/20 pt-16 md:mt-20">
          <div className="mx-auto max-w-container px-6 pb-20">
            <Reveal className="flex items-end justify-between gap-6">
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-body/50">
                  Recent Launch
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
                  Fresh off the build queue
                </h2>
              </div>
              <Button href="/portfolio" variant="ghost" size="sm" className="hidden md:inline-flex">
                All Work <ArrowRight size={14} />
              </Button>
            </Reveal>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {featuredPortfolio.map((item) => (
                <PortfolioCard key={item.slug} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section className="mx-auto max-w-container px-6 py-20">
          <Reveal className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-body/50">
                What We Do
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
                Services built around outcomes
              </h2>
            </div>
            <Button href="/services" variant="ghost" size="sm" className="hidden md:inline-flex">
              All Services <ArrowRight size={14} />
            </Button>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.slice(0, 4).map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </section>
      )}

      {/* Why teams choose us */}
      <section className="border-y border-tertiary/30 bg-primary-container/20">
        <div className="mx-auto max-w-container px-6 py-20">
          <Reveal className="max-w-xl">
            <p className="font-mono text-xs uppercase tracking-widest text-body/50">
              Why Teams Choose Us
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
              A studio that thinks like a co-founder, not a vendor
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <Card className="h-full">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-primary">
                    <v.icon size={20} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-primary">{v.title}</h3>
                  <p className="mt-3 text-sm text-body/70">{v.body}</p>
                </Card>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-body/50">
            What Clients Say
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-primary md:text-4xl">
            What clients say after launch
          </h2>
        </Reveal>
        <Testimonials testimonials={testimonials} />
      </section>

      <section className="border-t border-tertiary/30 bg-primary-container/30">
        <div className="mx-auto max-w-container px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              Have a project in mind?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-body/70">
              Tell us what you're building — we'll get back to you within one business day.
            </p>
            <Button href="/contact" size="lg" className="mt-8">
              Start a Project <ArrowRight size={16} />
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const [testimonials, portfolio, services] = await Promise.all([
      api.getTestimonials(),
      api.getPortfolio(),
      api.getServices(),
    ]);
    const featuredPortfolio = portfolio.filter((p) => p.featured).slice(0, 2);
    return {
      props: { testimonials, featuredPortfolio, services },
      revalidate: 3600,
    };
  } catch {
    return {
      props: { testimonials: [], featuredPortfolio: [], services: [] },
      revalidate: 60,
    };
  }
};