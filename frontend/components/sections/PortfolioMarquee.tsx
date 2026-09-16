import { useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import type { PortfolioItem } from '@/types';

function PortfolioPill({ item }: { item: PortfolioItem }) {
  return (
    <div
      data-marquee-pill
      className="shrink-0 will-change-[transform,opacity]"
      style={{
        transform: 'scale(1) translateZ(0)',
        opacity: 1,
        transformOrigin: 'center center',
      }}
    >
      <Link
        href={`/portfolio/${item.slug}`}
        className="group flex items-center gap-3.5 rounded-full border-2 border-white/90 bg-white px-5 py-3 shadow-lg shadow-black/20 transition-all duration-300 hover:scale-105 hover:border-white hover:bg-slate-50 hover:shadow-2xl active:scale-95"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B2A4A] to-[#4A6FA5] font-mono text-xs font-bold text-white shadow-sm transition-transform duration-300 group-hover:scale-110">
          {item.title.charAt(0).toUpperCase()}
        </span>
        <div className="flex flex-col text-left">
          <span className="whitespace-nowrap font-display text-sm font-bold tracking-tight text-[#1B2A4A] transition-colors group-hover:text-[#4A6FA5]">
            {item.title}
          </span>
          {item.technologies && item.technologies.length > 0 && (
            <span className="whitespace-nowrap font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {item.technologies[0]}
            </span>
          )}
        </div>
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-[#1B2A4A] transition-all duration-300 group-hover:bg-[#1B2A4A] group-hover:text-white group-hover:translate-x-0.5">
          →
        </span>
      </Link>
    </div>
  );
}

export function PortfolioMarquee({ items }: { items: PortfolioItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const repeatedItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (items.length < 6) {
      return [...items, ...items, ...items, ...items];
    }
    return [...items, ...items];
  }, [items]);

  useEffect(() => {
    if (reduceMotion || !items || items.length === 0) return;

    let animFrameId: number;
    let isRunning = true;

    const updatePills = () => {
      const container = containerRef.current;
      const track = trackRef.current;

      if (container && track) {
        const containerRect = container.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;
        const maxDistance = containerRect.width / 2;

        if (maxDistance > 0) {
          const pills = track.querySelectorAll<HTMLElement>('[data-marquee-pill]');

          for (let i = 0; i < pills.length; i++) {
            const pill = pills[i];
            const pillRect = pill.getBoundingClientRect();
            const pillCenterX = pillRect.left + pillRect.width / 2;

            // Horizontal distance relative to viewport/container center
            const dist = Math.abs(pillCenterX - containerCenterX);
            const normDist = Math.min(1, dist / maxDistance);

            // Cosine easing: 1 at center (dist = 0), 0 at container edges (dist = maxDistance)
            const t = Math.cos(normDist * (Math.PI / 2));

            // Scale from 0.9 (edges) up to 1.1 (center)
            const scale = 0.9 + 0.2 * t;

            // Opacity from 0.6 (edges) up to 1.0 (center)
            const opacity = 0.6 + 0.4 * t;

            pill.style.transform = `scale(${scale.toFixed(3)}) translateZ(0)`;
            pill.style.opacity = opacity.toFixed(3);
          }
        }
      }

      if (isRunning) {
        animFrameId = requestAnimationFrame(updatePills);
      }
    };

    animFrameId = requestAnimationFrame(updatePills);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animFrameId);
    };
  }, [reduceMotion, items, repeatedItems]);

  if (!items || items.length === 0) return null;

  return (
    <section className="relative border-y border-white/10 bg-[#1B2A4A] py-8 md:py-10">
      <div className="mx-auto mb-4 flex items-center justify-center gap-2 px-6">
        <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-white/70">
          Featured Client Projects &amp; Work
        </p>
      </div>

      {reduceMotion ? (
        <div className="scrollbar-none flex gap-4 overflow-x-auto px-6" style={{ scrollbarWidth: 'none' }}>
          {items.map((item) => (
            <PortfolioPill key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <div ref={containerRef} className="group/marquee relative overflow-hidden">
          {/* Fade gradient masks on both sides for seamless edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#1B2A4A] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#1B2A4A] to-transparent" />

          {/* Marquee track */}
          <div
            ref={trackRef}
            className="animate-marquee flex w-max gap-4 py-3 group-hover/marquee:[animation-play-state:paused]"
          >
            {repeatedItems.map((item, i) => (
              <PortfolioPill key={`${item.slug}-${i}`} item={item} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

