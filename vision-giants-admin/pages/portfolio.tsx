// pages/portfolio.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { PortfolioItem } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import PortfolioFormModal from '@/components/admin/PortfolioFormModal';

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<PortfolioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  function loadItems() {
    setIsLoading(true);
    adminApi
      .get<PortfolioItem[]>('/admin/portfolio')
      .then((res) => setItems(res.data ?? []))
      .finally(() => setIsLoading(false));
  }

  function handleAddNew() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function handleEdit(item: PortfolioItem) {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await adminApi.delete(`/admin/portfolio/${deletingItem.id}`);
      setItems((prev) => prev.filter((i) => i.id !== deletingItem.id));
      setDeletingItem(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<PortfolioItem>[] = [
    { key: 'title', header: 'Title' },
    { key: 'client_name', header: 'Client' },
    {
      key: 'technologies',
      header: 'Tech',
      render: (i) => i.technologies.join(', '),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (i) => (i.featured ? '★' : '—'),
    },
  ];

  return (
    <>
      <Head>
        <title>Portfolio — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Portfolio</h1>
        <button type="button" onClick={handleAddNew} className="admin-button-primary">
          + Add Portfolio Item
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        isLoading={isLoading}
        emptyMessage="No portfolio items yet — add your first case study."
        onEdit={handleEdit}
        onDelete={setDeletingItem}
      />

      {isFormOpen && (
        <PortfolioFormModal
          item={editingItem}
          onClose={() => setIsFormOpen(false)}
          onSaved={(saved) => {
            setIsFormOpen(false);
            setItems((prev) => {
              const exists = prev.some((i) => i.id === saved.id);
              return exists
                ? prev.map((i) => (i.id === saved.id ? saved : i))
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        title="Delete portfolio item?"
        message={`This will permanently remove "${deletingItem?.title}".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingItem(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}