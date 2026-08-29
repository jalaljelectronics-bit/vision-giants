import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger children (each direct child should be a <RevealItem>) */
  stagger?: boolean;
  staggerAmount?: number;
  delay?: number;
  as?: 'div' | 'section';
}

/**
 * Scroll-triggered fade + rise. Wrap a section or a grid with this;
 * for staggered grids, set `stagger` and wrap each child in <RevealItem>.
 * Automatically disables motion for users who've asked for reduced motion.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  staggerAmount = 0.09,
  delay = 0,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger ? staggerContainer(staggerAmount, delay) : fadeUp}
      transition={stagger ? undefined : { delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Self-contained reveal for grid items (cards) that are mapped from data
 * without an index — each card triggers independently as it scrolls into
 * view, rather than requiring a stagger-parent wrapper on every page.
 */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}