import { GetServerSideProps } from 'next';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
import type { Service, PortfolioItem, BlogPost, JobPosting } from '@/types';

const STATIC_ROUTES = ['', '/about', '/services', '/portfolio', '/blog', '/careers', '/contact'];

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority?: string;
}

function generateSitemap(urls: SitemapUrl[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority ?? '0.7'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const base = siteConfig.url;

  const urls: SitemapUrl[] = STATIC_ROUTES.map((route) => ({
    loc: `${base}${route}`,
    priority: route === '' ? '1.0' : '0.8',
  }));

  try {
    const [services, portfolio, posts, jobs] = await Promise.all([
      api.getServices(),
      api.getPortfolio(),
      api.getBlogPosts(),
      api.getJobs(),
    ]);

    services.forEach((s: Service) =>
      urls.push({ loc: `${base}/services/${s.slug}`, priority: '0.7' })
    );

    portfolio.forEach((p: PortfolioItem) =>
      urls.push({ loc: `${base}/portfolio/${p.slug}`, priority: '0.7' })
    );

    posts
      .filter((p: BlogPost) => p.published)
      .forEach((p: BlogPost) =>
        urls.push({
          loc: `${base}/blog/${p.slug}`,
          lastmod: new Date(p.published_at).toISOString(),
          priority: '0.6',
        })
      );

    jobs
      .filter((j: JobPosting) => j.is_active)
      .forEach((j: JobPosting) =>
        urls.push({ loc: `${base}/careers/${j.slug}`, priority: '0.6' })
      );
  } catch {
    // Static routes still get served even if the backend is unreachable
  }

  res.setHeader('Content-Type', 'text/xml');
  res.write(generateSitemap(urls));
  res.end();

  return { props: {} };
};