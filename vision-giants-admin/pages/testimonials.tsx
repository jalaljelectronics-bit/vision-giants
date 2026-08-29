
// pages/testimonials.tsx

import { useEffect, useState } from 'react';
import Head from 'next/head';
import type { Testimonial } from '@/types';
import { adminApi } from '@/lib/api';
import DataTable, { Column } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TestimonialFormModal from '@/components/admin/TestimonialFormModal';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] =
    useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    setIsLoading(true);

    try {
      const res =
        await adminApi.get<Testimonial[]>('/testimonials');

      setTestimonials(res.data ?? []);
    } catch (error) {
      console.error(
        'Failed to load testimonials:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddNew() {
    setEditingTestimonial(null);
    setIsFormOpen(true);
  }

  function handleEdit(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!deletingTestimonial) return;

    setIsDeleting(true);

    try {
      await adminApi.delete(
        `/testimonials/${deletingTestimonial.id}`
      );

      setTestimonials((prev) =>
        prev.filter(
          (testimonial) =>
            testimonial.id !==
            deletingTestimonial.id
        )
      );

      setDeletingTestimonial(null);
    } catch (error) {
      console.error(
        'Failed to delete testimonial:',
        error
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<Testimonial>[] = [
    {
      key: 'client_name',
      header: 'Client',
    },
    {
      key: 'client_company',
      header: 'Company',
    },
    {
      key: 'content',
      header: 'Quote',
      render: (testimonial) =>
        testimonial.content.length > 60
          ? `${testimonial.content.slice(0, 60)}…`
          : testimonial.content,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (testimonial) =>
        '★'.repeat(testimonial.rating),
    },
  ];

  return (
    <>
      <Head>
        <title>
          Testimonials — Vision Giants Admin
        </title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">
          Testimonials
        </h1>

        <button
          type="button"
          onClick={handleAddNew}
          className="admin-button-primary"
        >
          + Add Testimonial
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={testimonials}
        isLoading={isLoading}
        emptyMessage="No testimonials yet — add your first one."
        onEdit={handleEdit}
        onDelete={setDeletingTestimonial}
      />

      {isFormOpen && (
        <TestimonialFormModal
          testimonial={editingTestimonial}
          onClose={() => setIsFormOpen(false)}
          onSaved={(saved) => {
            setIsFormOpen(false);

            setTestimonials((prev) => {
              const exists = prev.some(
                (testimonial) =>
                  testimonial.id === saved.id
              );

              return exists
                ? prev.map((testimonial) =>
                    testimonial.id === saved.id
                      ? saved
                      : testimonial
                  )
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingTestimonial)}
        title="Delete testimonial?"
        message={`This will permanently remove the testimonial from "${
          deletingTestimonial?.client_name ??
          'this client'
        }".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() =>
          setDeletingTestimonial(null)
        }
        isConfirming={isDeleting}
      />
    </>
  );
}
