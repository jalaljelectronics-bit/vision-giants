import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';

interface Crumb {
  label: string;
  href?: string;
}

interface HeroBandProps {
  eyebrow: string;
  title: string;
  crumbs: Crumb[];
}

export function HeroBand({ eyebrow, title, crumbs }: HeroBandProps) {
  return (
    <section className="relative isolate overflow-hidden bg-primary">
      {/* Chrome gradient wash — same metallic language as the CTA buttons,
          used here as texture instead of a photo/particle background. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgb(255 255 255 / 0.10) 0%, transparent 45%), radial-gradient(circle at 85% 80%, rgb(255 255 255 / 0.08) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 z-0 h-px bg-white/10" />

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="relative z-10 mx-auto max-w-container px-6 py-16 md:py-20"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-white/50">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
          {title}
        </h1>
        <nav aria-label="Breadcrumb" className="mt-5 flex items-center gap-2 text-sm text-white/50">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </motion.div>
    </section>
  );
}