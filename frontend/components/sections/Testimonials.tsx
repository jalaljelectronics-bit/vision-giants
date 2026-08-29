import Image from 'next/image';
import { RevealItem } from '@/components/motion/Reveal';
import type { Testimonial } from '@/types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {testimonials.map((t) => (
        <RevealItem key={t.id}>
          <figure className="h-full rounded-2xl border border-tertiary/40 bg-surface p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5">
            <blockquote className="text-sm text-body/80">"{t.content}"</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.photo && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary-container">
                  <Image src={t.photo} alt={t.client_name} fill className="object-cover" sizes="40px" />
                </div>
              )}
              <div>
                <p className="font-display text-sm font-semibold text-primary">
                  {t.client_name}
                </p>
                <p className="text-xs text-body/60">{t.client_company}</p>
              </div>
            </figcaption>
          </figure>
        </RevealItem>
      ))}
    </div>
  );
}