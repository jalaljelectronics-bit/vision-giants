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
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTestimonial, setDeletingTestimonial] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTestimonials();
  }, []);

  function loadTestimonials() {
    setIsLoading(true);
    adminApi
      .get<Testimonial[]>('/admin/testimonials')
      .then((res) => setTestimonials(res.data ?? []))
      .finally(() => setIsLoading(false));
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
      await adminApi.delete(`/admin/testimonials/${deletingTestimonial.id}`);
      setTestimonials((prev) => prev.filter((t) => t.id !== deletingTestimonial.id));
      setDeletingTestimonial(null);
    } finally {
      setIsDeleting(false);
    }
  }

  const columns: Column<Testimonial>[] = [
    { key: 'client_name', header: 'Client' },
    { key: 'client_company', header: 'Company' },
    {
      key: 'content',
      header: 'Quote',
      render: (t) => (t.content.length > 60 ? `${t.content.slice(0, 60)}…` : t.content),
    },
    { key: 'rating', header: 'Rating', render: (t) => '★'.repeat(t.rating) },
  ];

  return (
    <>
      <Head>
        <title>Testimonials — Vision Giants Admin</title>
      </Head>

      <div className="admin-page-header">
        <h1 className="admin-page-title">Testimonials</h1>
        <button type="button" onClick={handleAddNew} className="admin-button-primary">
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
              const exists = prev.some((t) => t.id === saved.id);
              return exists
                ? prev.map((t) => (t.id === saved.id ? saved : t))
                : [...prev, saved];
            });
          }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deletingTestimonial)}
        title="Delete testimonial?"
        message={`This will permanently remove the testimonial from "${deletingTestimonial?.client_name}".`}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingTestimonial(null)}
        isConfirming={isDeleting}
      />
    </>
  );
}