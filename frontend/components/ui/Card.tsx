import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-tertiary/40 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5',
        className
      )}
      {...rest}
    >
      {children}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px chrome-rule opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}