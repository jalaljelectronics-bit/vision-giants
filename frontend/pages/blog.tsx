import { GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { HeroBand } from '@/components/layout/HeroBand';
import { BlogCard } from '@/components/sections/BlogCard';
import { Reveal } from '@/components/motion/Reveal';
import { api } from '@/lib/api';
import { siteConfig, cn } from '@/lib/utils';
import type { BlogPost } from '@/types';

interface Props {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: Props) {
  return (
    <>
      <Seo
        title="Blog"
        description="Engineering notes, product thinking, and lessons from building software at Vision Giants."
        path="/blog"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Blog', url: `${siteConfig.url}/blog` },
        ]}
      />

      <HeroBand
        eyebrow="Blog"
        title="Notes from the studio"
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        variant="blog"
      />

      <section className="mx-auto max-w-container px-6 py-20">
        <Reveal className="max-w-xl">
          <p className="text-body/70">
            Engineering, product, and process — what we're learning as we build.
          </p>
        </Reveal>

        {posts.length === 0 ? (
          <p className="mt-16 text-body/50">No posts published yet — check back soon.</p>
        ) : (
          <>
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Pagination — decorative until the archive grows past one page */}
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                disabled
                className="rounded-full border border-tertiary/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-body/40"
              >
                Prev
              </button>
              <span
                className={cn(
                  'chrome-shimmer flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white'
                )}
              >
                1
              </span>
              <button
                disabled
                className="rounded-full border border-tertiary/40 px-4 py-2 font-mono text-xs uppercase tracking-widest text-body/40"
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const all = await api.getBlogPosts();
    const posts = all
      .filter((p) => p.published)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    return { props: { posts }, revalidate: 1800 };
  } catch {
    return { props: { posts: [] }, revalidate: 60 };
  }
};