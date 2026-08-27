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

  function loadPosts() {
    setIsLoading(true);
    adminApi
      .get<BlogPost[]>('/admin/blog')
      .then((res) => setPosts(res.data ?? []))
      .finally(() => setIsLoading(false));
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
      await adminApi.delete(`/admin/blog/${deletingPost.id}`);
      setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id));
      setDeletingPost(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<BlogPost>[] = [
    { key: 'title', header: 'Title' },
    {
      key: 'published',
      header: 'Status',
      render: (p) => (
        <span className={p.published ? 'admin-badge-success' : 'admin-badge-pending'}>
          {p.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'published_at',
      header: 'Published At',
      render: (p) => (p.published_at ? new Date(p.published_at).toLocaleDateString() : '—'),
    },
  ];

  return (
    <>
      <Head>
        <title>Blog — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Blog</h1>
        <button type="button" onClick={handleAddNew} className="admin-button-primary">
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
              const exists = prev.some((p) => p.id === saved.id);
              return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingPost)}
        title="Delete post?"
        message={`This will permanently remove "${deletingPost?.title}".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingPost(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}