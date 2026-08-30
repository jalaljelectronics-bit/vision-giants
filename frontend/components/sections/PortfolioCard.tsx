import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/lib/utils';
import { RevealItem } from '@/components/motion/Reveal';
import type { PortfolioItem } from '@/types';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <RevealItem>
      <Link
        href={`/portfolio/${item.slug}`}
        className="group block overflow-hidden rounded-2xl border border-tertiary/40 bg-surface transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-primary-container">
          <Image
            src={item.cover_image}
            alt={`${item.title} — project by ${siteConfig.name}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute left-4 top-4 flex gap-2">
            {item.featured && (
              <span className="rounded-full bg-surface/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                Featured
              </span>
            )}
            {item.is_new_arrival && (
              <span className="chrome-shimmer rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                New
              </span>
            )}
          </div>
        </div>
        <div className="p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-body/50">
            {item.client_name}
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-primary">{item.title}</h2>
          {/* Leads with the outcome rather than the setup — more compelling
              as a card teaser; challenge/solution live on the detail page. */}
          <p className="mt-2 line-clamp-2 text-sm text-body/70">{item.result}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-primary-container px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </RevealItem>
  );
}