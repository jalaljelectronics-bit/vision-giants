import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { PortfolioCard } from '@/components/sections/PortfolioCard';
import type { PortfolioItem } from '@/types';

interface RecentProjectsCarouselProps {
  items: PortfolioItem[];
}

const ROTATE_INTERVAL_MS = 2800; // 2.8s auto-rotation
const TRANSITION_DURATION = 0.4; // 400ms transition

export function RecentProjectsCarousel({ items }: RecentProjectsCarouselProps) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Group all portfolio projects into pairs (2 cards at a time)
  const pairs = useMemo(() => {
    const result: PortfolioItem[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      result.push(items.slice(i, i + 2));
    }
    return result;
  }, [items]);

  // Safe active index in case items change
  const activeIndex = currentIndex >= pairs.length ? 0 : currentIndex;
  const currentPair = pairs[activeIndex] || [];

  // Auto-rotation every 2.5-3 seconds (pauses on hover and when reduced motion is preferred)
  useEffect(() => {
    if (reduceMotion || pairs.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pairs.length);
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [pairs.length, isHovered, reduceMotion]);

  if (items.length === 0) return null;

  // Slide-and-fade swap variants:
  // Current pair slides out to the left (x: -40px) while fading to opacity: 0
  // Next pair slides in from the right (x: 40px -> x: 0) while fading to opacity: 1
  const slideVariants = {
    enter: {
      opacity: 0,
      x: 40,
    },
    center: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: -40,
    },
  };

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
            variants={reduceMotion ? undefined : slideVariants}
            initial={reduceMotion ? false : 'enter'}
            animate={reduceMotion ? undefined : 'center'}
            exit={reduceMotion ? undefined : 'exit'}
            transition={{
              duration: TRANSITION_DURATION,
              ease: [0.4, 0, 0.2, 1], // ease-in-out curve
            }}
            className="grid gap-8 md:grid-cols-2"
          >
            {currentPair.map((item) => (
              <PortfolioCard key={item.slug} item={item} disableReveal />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot/line pagination indicators showing current position */}
      {pairs.length > 1 && (
        <div
          className="mt-8 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Recent project carousel slides"
        >
          {pairs.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1} of ${pairs.length}`}
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

