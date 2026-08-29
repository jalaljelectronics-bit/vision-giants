import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { EASE_PREMIUM } from '@/lib/motion';

/**
 * Wraps <Component {...pageProps} /> in _app.tsx. Cross-fades + lifts
 * the incoming page rather than hard-cutting, and gets out of the way
 * entirely for prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={router.asPath}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: EASE_PREMIUM }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}