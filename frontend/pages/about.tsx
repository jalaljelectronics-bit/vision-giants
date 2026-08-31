import { GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { HeroBand } from '@/components/layout/HeroBand';
import { Reveal, RevealItem } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { TeamMember } from '@/types';
import { ArrowRight, Users } from 'lucide-react';
import Image from 'next/image';

interface Props {
  team: TeamMember[];
}

const CEO_PHOTO =
  'https://res.cloudinary.com/r2fk1fws/image/upload/v1785584354/nexbyte/images/ykbp1vvu5jxcaiszhr76.png';

const VALUES = [
  {
    title: 'Ship, then refine',
    body: 'We favor working software over long planning cycles — get something real in front of users early.',
  },
  {
    title: 'Engineering as craft',
    body: 'Clean architecture and readable code aren\u2019t optional extras — they\u2019re how we keep moving fast for years, not weeks.',
  },
  {
    title: 'Partnership over handoff',
    body: 'We stay close to the outcome, not just the deliverable — your roadmap is our roadmap.',
  },
];

export default function AboutPage({ team }: Props) {
  // Pulls the real name/role from whoever's marked CEO/Founder on the team
  // API, if anyone is; otherwise falls back to a placeholder you can edit.
  const ceoFromApi = team.find((m) => /ceo|founder/i.test(m.role));
  const ceo = ceoFromApi ?? { name: 'Jalal Khan', role: 'CEO', photo: CEO_PHOTO, id: 0, order: 0 };

  return (
    <>
      <Seo
        title="About"
        description="Vision Giants is a software studio of engineers and designers building web, mobile, and custom products for ambitious teams."
        path="/about"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'About', url: `${siteConfig.url}/about` },
        ]}
      />

      <HeroBand
        eyebrow="About Us"
        title="A studio built by people who ship"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
        icon={Users}
      />

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="max-w-xl">
          <p className="text-body/70">
            {siteConfig.name} started as a small team of engineers frustrated with slow,
            over-processed software delivery. Today we're a full studio — but the standard
            hasn't changed: build things well, ship them fast, stay accountable to the result.
          </p>
        </Reveal>
      </section>

      <section className="border-y border-tertiary/30 bg-primary-container/20">
        <div className="mx-auto max-w-container px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              What we believe
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <RevealItem key={v.title}>
                <Card className="h-full">
                  <h3 className="font-display text-lg font-semibold text-primary">{v.title}</h3>
                  <p className="mt-3 text-sm text-body/70">{v.body}</p>
                </Card>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-primary-container">
            <Image
              src={CEO_PHOTO}
              alt={ceo.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              A message from our CEO
            </h2>
            {/* Swap this quote for the real one whenever you have it —
                there's no "quote" field on TeamMember yet, so it's static
                copy here rather than pulled from the API. */}
            <p className="mt-6 text-lg text-body/80">
              "Great software isn't the one with the most features — it's the one that quietly
              gets out of your way and does its job. That's what we build for every client,
              every time."
            </p>
            <p className="mt-6 font-display font-semibold text-primary">{ceo.name}</p>
            <p className="text-sm text-body/60">{ceo.role}</p>
          </div>
        </Reveal>
      </section>

      {team.length > 0 && (
        <section className="mx-auto max-w-container px-6 py-20">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              Meet the team
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {team.map((member) => (
              <RevealItem key={member.id}>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-primary-container">
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.role} at ${siteConfig.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <p className="mt-4 font-display font-semibold text-primary">{member.name}</p>
                <p className="text-sm text-body/60">{member.role}</p>
              </RevealItem>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-tertiary/30 bg-primary-container/30">
        <div className="mx-auto max-w-container px-6 py-20 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-primary md:text-4xl">
              Want to work with us?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-body/70">
              We're always open to conversations about interesting projects — and good people.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" size="lg">
                Start a Project <ArrowRight size={16} />
              </Button>
              <Button href="/careers" variant="secondary" size="lg">
                View Careers
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const team = await api.getTeam();
    return { props: { team }, revalidate: 3600 };
  } catch {
    return { props: { team: [] }, revalidate: 60 };
  }
};