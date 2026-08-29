import Image from 'next/image';
import { siteConfig } from '@/lib/utils';
import { RevealItem } from '@/components/motion/Reveal';
import type { TeamMember } from '@/types';

interface TeamGridProps {
  team: TeamMember[];
}

export function TeamGrid({ team }: TeamGridProps) {
  if (team.length === 0) return null;

  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
      {team.map((member) => (
        <RevealItem key={member.id}>
          <div className="group relative aspect-square overflow-hidden rounded-2xl bg-primary-container">
            <Image
              src={member.photo}
              alt={`${member.name}, ${member.role} at ${siteConfig.name}`}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <p className="mt-4 font-display font-semibold text-primary">{member.name}</p>
          <p className="text-sm text-body/60">{member.role}</p>
        </RevealItem>
      ))}
    </div>
  );
}