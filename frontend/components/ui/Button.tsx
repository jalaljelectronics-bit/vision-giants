import { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

interface ButtonAsButton extends BaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  external?: boolean;
  children: React.ReactNode;
}
type Props = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<Variant, string> = {
  primary: 'chrome-shimmer sheen text-white shadow-sm hover:shadow-md hover:shadow-primary/20',
  secondary:
    'sheen bg-primary-container text-primary hover:bg-primary-container/70 border border-tertiary/40',
  ghost: 'text-primary hover:bg-primary-container/50',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

// Pure CSS lift + press -- a spring-y hover rise and a satisfying compress
// on click, without pulling framer-motion into the ref/typing chain here.
const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-mono uppercase tracking-widest ' +
  'transition-[transform,box-shadow] duration-200 ease-out ' +
  'hover:-translate-y-0.5 hover:scale-[1.015] active:scale-95 active:translate-y-0 ' +
  'focus-visible:outline-2';

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { variant = 'primary', size = 'md', className } = props;
  const classes = cn(base, variantStyles[variant], sizeStyles[size], className);

  if ('href' in props && props.href) {
    const { href, external, children } = props;
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { children, ...rest } = props as ButtonAsButton;
  return (
    <button ref={ref} className={classes} {...rest}>
      {children}
    </button>
  );
});

Button.displayName = 'Button';