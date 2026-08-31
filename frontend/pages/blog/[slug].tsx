import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/components/seo/JsonLd';
import { api } from '@/lib/api';
import { siteConfig, formatDate, readingTime } from '@/lib/utils';
import type { BlogPost } from '@/types';
import { ArrowRight } from 'lucide-react';

interface Props {
  post: BlogPost;
}

export default function BlogPostPage({ post }: Props) {
  const url = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      <Seo
        title={post.meta_title || post.title}
        description={post.meta_description}
        path={`/blog/${post.slug}`}
        image={post.cover_image}
        type="article"
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Blog', url: `${siteConfig.url}/blog` },
          { name: post.title, url },
        ]}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.meta_description}
        image={post.cover_image}
        datePublished={post.published_at}
        url={url}
      />

      {/* pt-32/md:pt-40 clears the fixed floating header, which no longer
          reserves its own space in normal document flow. */}
      <article className="mx-auto max-w-3xl px-6 pb-20 pt-32 md:pt-40">
        <p className="font-mono text-xs uppercase tracking-widest text-body/50">
          {formatDate(post.published_at)} · {readingTime(post.content)} min read
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-primary md:text-5xl">
          {post.title}
        </h1>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-primary-container">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        <div className="prose prose-slate mt-10 max-w-none prose-headings:font-display prose-headings:text-primary prose-a:text-primary prose-img:rounded-xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        <div className="mt-14 rounded-2xl border border-tertiary/40 bg-primary-container/30 p-8 text-center">
          <h2 className="font-display text-2xl font-semibold text-primary">
            Have a project in mind?
          </h2>
          <Button href="/contact" size="lg" className="mt-6">
            Start a Project <ArrowRight size={16} />
          </Button>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const posts = await api.getBlogPosts();
    return {
      paths: posts.filter((p) => p.published).map((p) => ({ params: { slug: p.slug } })),
      fallback: 'blocking',
    };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  try {
    const post = await api.getBlogPost(params!.slug as string);
    if (!post.published) return { notFound: true };
    return { props: { post }, revalidate: 1800 };
  } catch {
    return { notFound: true };
  }
};