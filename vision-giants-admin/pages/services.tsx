
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
  const [editingService, setEditingService] =
    useState<Service | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingService, setDeletingService] =
    useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setIsLoading(true);

    try {
      const res =
        await adminApi.get<Service[]>('/services');

      setServices(res.data ?? []);
    } catch (error) {
      console.error(
        'Failed to load services:',
        error
      );
    } finally {
      setIsLoading(false);
    }
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
      await adminApi.delete(
        `/services/${deletingService.id}`
      );

      setServices((prev) =>
        prev.filter(
          (service) =>
            service.id !== deletingService.id
        )
      );

      setDeletingService(null);
    } catch (error) {
      console.error(
        'Failed to delete service:',
        error
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<Service>[] = [
    {
      key: 'order',
      header: 'Order',
    },
    {
      key: 'title',
      header: 'Title',
    },
    {
      key: 'slug',
      header: 'Slug',
    },
    {
      key: 'short_description',
      header: 'Summary',
      render: (service) =>
        service.short_description.length > 60
          ? `${service.short_description.slice(
              0,
              60
            )}…`
          : service.short_description,
    },
  ];

  return (
    <>
      <Head>
        <title>
          Services — Vision Giants Admin
        </title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Services
        </h1>

        <button
          type="button"
          onClick={handleAddNew}
          className="admin-button-primary"
        >
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
              const exists = prev.some(
                (service) =>
                  service.id === saved.id
              );

              return exists
                ? prev.map((service) =>
                    service.id === saved.id
                      ? saved
                      : service
                  )
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingService)}
        title="Delete service?"
        message={`This will permanently remove "${
          deletingService?.title ??
          'this service'
        }".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() =>
          setDeletingService(null)
        }
        isConfirming={isDeleting}
      />
    </>
  );
}

