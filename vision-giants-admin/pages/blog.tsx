
// pages/blog.tsx

import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { BlogPost } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import BlogFormModal from '@/components/admin/BlogFormModal';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState<BlogPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setIsLoading(true);

    try {
      const res = await adminApi.get<BlogPost[]>('/blog/admin/all');
      setPosts(res.data ?? []);
    } catch (error) {
      console.error('Failed to load blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddNew() {
    setEditingPost(null);
    setIsFormOpen(true);
  }

  function handleEdit(post: BlogPost) {
    setEditingPost(post);
    setIsFormOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!deletingPost) return;

    setIsDeleting(true);

    try {
      await adminApi.delete(`/blog/${deletingPost.id}`);

      setPosts((prev) =>
        prev.filter((post) => post.id !== deletingPost.id)
      );

      setDeletingPost(null);
    } catch (error) {
      console.error('Failed to delete blog post:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      header: 'Title',
    },
    {
      key: 'published',
      header: 'Status',
      render: (post) => (
        <span
          className={
            post.published
              ? 'admin-badge-success'
              : 'admin-badge-pending'
          }
        >
          {post.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'published_at',
      header: 'Published At',
      render: (post) =>
        post.published_at
          ? new Date(post.published_at).toLocaleDateString()
          : '—',
    },
  ];

  return (
    <>
      <Head>
        <title>Blog — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Blog</h1>

        <button
          type="button"
          onClick={handleAddNew}
          className="admin-button-primary"
        >
          + New Post
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={posts}
        isLoading={isLoading}
        emptyMessage="No posts yet — write your first one."
        onEdit={handleEdit}
        onDelete={setDeletingPost}
      />

      {isFormOpen && (
        <BlogFormModal
          post={editingPost}
          onClose={() => setIsFormOpen(false)}
          onSaved={(saved) => {
            setIsFormOpen(false);

            setPosts((prev) => {
              const exists = prev.some(
                (post) => post.id === saved.id
              );

              return exists
                ? prev.map((post) =>
                    post.id === saved.id ? saved : post
                  )
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingPost)}
        title="Delete post?"
        message={`This will permanently remove "${
          deletingPost?.title ?? 'this post'
        }".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingPost(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}

