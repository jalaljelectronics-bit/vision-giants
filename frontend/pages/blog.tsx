import { GetStaticProps } from 'next';
import { Seo } from '@/components/seo/Seo';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { BlogCard } from '@/components/sections/BlogCard';
import { api } from '@/lib/api';
import { siteConfig } from '@/lib/utils';
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

      <section className="mx-auto max-w-container px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-body/50">Blog</p>
        <h1 className="mt-2 max-w-2xl font-display text-4xl font-semibold text-primary md:text-5xl">
          Notes from the studio
        </h1>
        <p className="mt-4 max-w-xl text-body/70">
          Engineering, product, and process — what we're learning as we build.
        </p>

        {posts.length === 0 ? (
          <p className="mt-16 text-body/50">No posts published yet — check back soon.</p>
        ) : (
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
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