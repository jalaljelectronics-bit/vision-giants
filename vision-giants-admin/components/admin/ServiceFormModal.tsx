// components/admin/ServiceFormModal.tsx
import { useState, FormEvent } from 'react';
import type { Service } from '@/types';
import { adminApi } from '@/lib/api';

interface ServiceFormModalProps {
  service: Service | null; // null = creating new
  onClose: () => void;
  onSaved: (service: Service) => void;
}

interface ServiceFormState {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image: string;
  order: number;
}

function toFormState(service: Service | null): ServiceFormState {
  if (!service) {
    return {
      title: '',
      slug: '',
      short_description: '',
      description: '',
      image: '',
      order: 0,
    };
  }
  return {
    title: service.title,
    slug: service.slug,
    short_description: service.short_description,
    description: service.description,
    image: service.image,
    order: service.order,
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function ServiceFormModal({
  service,
  onClose,
  onSaved,
}: ServiceFormModalProps) {
  const [form, setForm] = useState<ServiceFormState>(toFormState(service));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(service);

  function updateField<K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleTitleChange(value: string) {
    updateField('title', value);
    // Auto-fill slug from title, but only while creating —
    // don't clobber a manually-edited slug on an existing service.
    if (!isEditing) {
      updateField('slug', slugify(value));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const res = isEditing
        ? await adminApi.put<Service>(`/admin/services/${service!.id}`, form)
        : await adminApi.post<Service>('/admin/services', form);

      if (!res.data) throw new Error('No data returned');
      onSaved(res.data);
    } catch {
      setError('Could not save service. Check the fields and try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <form
        className="admin-modal admin-modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{isEditing ? 'Edit Service' : 'Add Service'}</h2>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />

        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          value={form.slug}
          onChange={(e) => updateField('slug', e.target.value)}
          required
        />

        <label htmlFor="short_description">Short Description</label>
        <textarea
          id="short_description"
          value={form.short_description}
          onChange={(e) => updateField('short_description', e.target.value)}
          rows={2}
          required
        />

        <label htmlFor="description">Full Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={5}
          required
        />

        <label htmlFor="image">Image URL</label>
        <input
          id="image"
          value={form.image}
          onChange={(e) => updateField('image', e.target.value)}
          placeholder="Uploaded via Cloudinary widget — see note below"
        />

        <label htmlFor="order">Display Order</label>
        <input
          id="order"
          type="number"
          value={form.order}
          onChange={(e) => updateField('order', Number(e.target.value))}
        />

        {error && <p className="admin-error-text">{error}</p>}

        <div className="admin-modal-actions">
          <button type="button" onClick={onClose} className="admin-button-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSaving} className="admin-button-primary">
            {isSaving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}