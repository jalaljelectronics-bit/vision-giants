// pages/services.tsx
import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { Service } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ServiceFormModal from '@/components/admin/ServiceFormModal';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  function loadServices() {
    setIsLoading(true);
    adminApi
      .get<Service[]>('/admin/services')
      .then((res) => setServices(res.data ?? []))
      .finally(() => setIsLoading(false));
  }

  function handleAddNew() {
    setEditingService(null);
    setIsFormOpen(true);
  }

  function handleEdit(service: Service) {
    setEditingService(service);
    setIsFormOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!deletingService) return;
    setIsDeleting(true);
    try {
      await adminApi.delete(`/admin/services/${deletingService.id}`);
      setServices((prev) => prev.filter((s) => s.id !== deletingService.id));
      setDeletingService(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<Service>[] = [
    { key: 'order', header: 'Order' },
    { key: 'title', header: 'Title' },
    { key: 'slug', header: 'Slug' },
    {
      key: 'short_description',
      header: 'Summary',
      render: (s) =>
        s.short_description.length > 60
          ? `${s.short_description.slice(0, 60)}…`
          : s.short_description,
    },
  ];

  return (
    <>
      <Head>
        <title>Services — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Services</h1>
        <button type="button" onClick={handleAddNew} className="admin-button-primary">
          + Add Service
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={services}
        isLoading={isLoading}
        emptyMessage="No services yet — add your first one."
        onEdit={handleEdit}
        onDelete={setDeletingService}
      />

      {isFormOpen && (
        <ServiceFormModal
          service={editingService}
          onClose={() => setIsFormOpen(false)}
          onSaved={(saved) => {
            setIsFormOpen(false);
            setServices((prev) => {
              const exists = prev.some((s) => s.id === saved.id);
              return exists
                ? prev.map((s) => (s.id === saved.id ? saved : s))
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingService)}
        title="Delete service?"
        message={`This will permanently remove "${deletingService?.title}".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingService(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}