import type { Variants } from 'framer-motion';

/**
 * One shared easing curve + timing scale for the whole site.
 * Everything animates on this vocabulary so motion reads as
 * "one studio's decision," not scattered per-component effects.
 *
 * Typed as a plain cubic-bezier tuple rather than framer-motion's
 * `Transition['ease']` — that's a union type and not every transition
 * variant in the union carries an `ease` field, so indexing it that
 * way doesn't type-check.
 */
export const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1]; // "expo-out" — fast start, long soft settle

export const durations = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: EASE_PREMIUM },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: durations.base, ease: EASE_PREMIUM } },
};

/** Container that staggers its direct motion children into view. */
export const staggerContainer = (stagger = 0.09, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

/** Standard viewport config for scroll-triggered reveals: fires once, a little before full entry. */
export const viewportOnce = { once: true, margin: '-80px 0px -80px 0px' } as const;