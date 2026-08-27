import Head from 'next/head';
import { siteConfig } from '@/lib/utils';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

export function Seo({
  title,
  description,
  path = '',
  image = siteConfig.ogImage,
  type = 'website',
  noindex = false,
}: SeoProps) {
  const url = `${siteConfig.url}${path}`;
  const fullTitle = path === '' ? `${siteConfig.name} — Software Development Studio` : `${title} | ${siteConfig.name}`;
  const ogImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="theme-color" content="#1B2A4A" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#12172A" media="(prefers-color-scheme: dark)" />
    </Head>
  );
}