import Image from 'next/image';
import Link from 'next/link';
import { formatDate, readingTime } from '@/lib/utils';
import { RevealItem } from '@/components/motion/Reveal';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <RevealItem>
      <Link
        href={`/blog/${post.slug}`}
        className="group block overflow-hidden rounded-2xl border border-tertiary/40 bg-surface transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-primary-container">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-6">
          <p className="font-mono text-xs uppercase tracking-widest text-body/50">
            {formatDate(post.published_at)} · {readingTime(post.content)} min read
          </p>
          <h2 className="mt-2 font-display text-lg font-semibold text-primary">{post.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-body/70">{post.meta_description}</p>
        </div>
      </Link>
    </RevealItem>
  );
}