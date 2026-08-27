import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function readingTime(html: string): number {
  const words = html.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export const siteConfig = {
  name: 'Vision Giants',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://visiongiants.com',
  description:
    'Vision Giants is a software house building web, mobile, and custom digital products for ambitious teams.',
  ogImage: '/og-default.jpg',
  links: {
    linkedin: 'https://linkedin.com/company/vision-giants',
    github: 'https://github.com/vision-giants',
  },
};