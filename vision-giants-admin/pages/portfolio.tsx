
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
  const [editingItem, setEditingItem] =
    useState<PortfolioItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingItem, setDeletingItem] =
    useState<PortfolioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setIsLoading(true);

    try {
      const res =
        await adminApi.get<PortfolioItem[]>('/portfolio');

      setItems(res.data ?? []);
    } catch (error) {
      console.error(
        'Failed to load portfolio items:',
        error
      );
    } finally {
      setIsLoading(false);
    }
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
      await adminApi.delete(
        `/portfolio/${deletingItem.id}`
      );

      setItems((prev) =>
        prev.filter(
          (item) => item.id !== deletingItem.id
        )
      );

      setDeletingItem(null);
    } catch (error) {
      console.error(
        'Failed to delete portfolio item:',
        error
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<PortfolioItem>[] = [
    {
      key: 'title',
      header: 'Title',
    },
    {
      key: 'client_name',
      header: 'Client',
    },
    {
      key: 'technologies',
      header: 'Tech',
      render: (item) =>
        Array.isArray(item.technologies)
          ? item.technologies.join(', ')
          : '—',
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (item) =>
        item.featured ? '★' : '—',
    },
  ];

  return (
    <>
      <Head>
        <title>
          Portfolio — Vision Giants Admin
        </title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Portfolio
        </h1>

        <button
          type="button"
          onClick={handleAddNew}
          className="admin-button-primary"
        >
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
              const exists = prev.some(
                (item) => item.id === saved.id
              );

              return exists
                ? prev.map((item) =>
                    item.id === saved.id
                      ? saved
                      : item
                  )
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        title="Delete portfolio item?"
        message={`This will permanently remove "${
          deletingItem?.title ?? 'this portfolio item'
        }".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingItem(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}

