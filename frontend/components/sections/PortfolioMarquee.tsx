import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import type { PortfolioItem } from '@/types';

interface PortfolioMarqueeProps {
  items: PortfolioItem[];
}

interface PortfolioPillProps {
  item: PortfolioItem;
  index: number;
  isStarted: boolean;
  reduceMotion: boolean;
  isDuplicate?: boolean;
}

function PortfolioPill({
  item,
  index,
  isStarted,
  reduceMotion,
  isDuplicate = false,
}: PortfolioPillProps) {
  const [displayedText, setDisplayedText] = useState(() =>
    reduceMotion || isDuplicate ? item.title : ''
  );
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (reduceMotion || isDuplicate) {
      setDisplayedText(item.title);
      setIsTyping(false);
      return;
    }

    if (!isStarted) return;

    // Stagger start: ~170ms delay between consecutive pills
    const startDelay = index * 170;
    // Fast typewriter speed: 30ms per character
    const charSpeed = 30;
    let charIndex = 0;
    let charInterval: NodeJS.Timeout | null = null;

    const startTimer = setTimeout(() => {
      setIsTyping(true);

      charInterval = setInterval(() => {
        charIndex += 1;
        setDisplayedText(item.title.slice(0, charIndex));
        if (charIndex >= item.title.length) {
          if (charInterval) clearInterval(charInterval);
          setIsTyping(false);
        }
      }, charSpeed);
    }, startDelay);

    return () => {
      clearTimeout(startTimer);
      if (charInterval) clearInterval(charInterval);
    };
  }, [isStarted, item.title, index, reduceMotion, isDuplicate]);

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      aria-label={item.title}
      className="group flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 font-mono text-[11px] font-semibold text-white">
        {item.title.charAt(0).toUpperCase()}
      </span>
      <span className="sr-only">{item.title}</span>
      <span
        aria-hidden="true"
        className="inline-flex items-center whitespace-nowrap font-mono text-xs uppercase tracking-wide text-white/80 group-hover:text-white"
      >
        {reduceMotion || isDuplicate ? item.title : displayedText}
        {isTyping && (
          <span
            className="ml-0.5 inline-block font-mono font-normal text-white/90 animate-blink"
            aria-hidden="true"
          >
            |
          </span>
        )}
      </span>
    </Link>
  );
}

export function PortfolioMarquee({ items }: PortfolioMarqueeProps) {
  const reduceMotion = useReducedMotion();
  const [isStarted, setIsStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      setIsStarted(true);
      return;
    }

    const element = containerRef.current;
    if (!element) {
      setIsStarted(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [reduceMotion]);

  if (!items || items.length === 0) return null;

  if (reduceMotion) {
    return (
      <div
        ref={containerRef}
        className="border-t border-white/10 bg-primary py-5"
      >
        <div
          className="scrollbar-none flex gap-3 overflow-x-auto px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((item, i) => (
            <PortfolioPill
              key={item.slug}
              item={item}
              index={i}
              isStarted={true}
              reduceMotion={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="group/marquee overflow-hidden border-t border-white/10 bg-primary py-5"
    >
      <div className="animate-marquee flex w-max gap-3 group-hover/marquee:[animation-play-state:paused]">
        {items.map((item, i) => (
          <PortfolioPill
            key={`orig-${item.slug}-${i}`}
            item={item}
            index={i}
            isStarted={isStarted}
            reduceMotion={false}
            isDuplicate={false}
          />
        ))}
        {items.map((item, i) => (
          <PortfolioPill
            key={`clone-${item.slug}-${i}`}
            item={item}
            index={i}
            isStarted={isStarted}
            reduceMotion={false}
            isDuplicate={true}
          />
        ))}
      </div>
    </div>
  );
}

