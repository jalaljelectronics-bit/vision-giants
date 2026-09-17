import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Testimonial } from '@/types';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const ROTATE_INTERVAL_MS = 2000; // 2 seconds auto-shuffle

export function Testimonials({ testimonials }: TestimonialsProps) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Group testimonials into sets of 3
  const groups = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    const chunks: Testimonial[][] = [];
    for (let i = 0; i < testimonials.length; i += 3) {
      chunks.push(testimonials.slice(i, i + 3));
    }
    return chunks;
  }, [testimonials]);

  const activeIndex = currentIndex >= groups.length ? 0 : currentIndex;
  const currentGroup = groups[activeIndex] || [];

  // Auto-shuffle every 2 seconds when there are multiple sets
  useEffect(() => {
    if (reduceMotion || groups.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % groups.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [groups.length, isHovered, reduceMotion]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div
      className="mt-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="grid gap-6 md:grid-cols-3"
          >
            {currentGroup.map((t) => {
              const hasAuthorInfo = Boolean(t.photo || t.client_name || t.client_company);

              return (
                <figure
                  key={t.id}
                  className="flex h-full flex-col justify-between rounded-2xl border border-tertiary/40 bg-surface p-6 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div>
                    {t.rating && (
                      <div
                        className="mb-3 flex gap-0.5 text-xs text-amber-400"
                        aria-label={`${t.rating} out of 5 stars`}
                      >
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    )}
                    <blockquote className="text-sm text-body/80">"{t.content}"</blockquote>
                  </div>

                  {hasAuthorInfo && (
                    <figcaption className="mt-5 flex items-center gap-3">
                      {t.photo && (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-primary-container">
                          <Image
                            src={t.photo}
                            alt={t.client_name || 'Client'}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      )}
                      {(t.client_name || t.client_company) && (
                        <div>
                          {t.client_name && (
                            <p className="font-display text-sm font-semibold text-primary">
                              {t.client_name}
                            </p>
                          )}
                          {t.client_company && (
                            <p className="text-xs text-body/60">{t.client_company}</p>
                          )}
                        </div>
                      )}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination indicators for testimonial groups */}
      {groups.length > 1 && (
        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Testimonial slides"
        >
          {groups.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to testimonial group ${i + 1} of ${groups.length}`}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-primary ${
                i === activeIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-primary/25 hover:bg-primary/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}