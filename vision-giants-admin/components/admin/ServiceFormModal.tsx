import { useState, FormEvent } from 'react';
import type { Service } from '@/types';
import { adminApi } from '@/lib/api';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

interface ServiceFormModalProps {
  service: Service | null;
  onClose: () => void;
  onSaved: (service: Service) => void;
}

interface SubServiceState {
  id: string;
  title: string;
  description: string;
}

interface ServiceFormState {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image: string;
  sub_services: SubServiceState[];
  order: number;
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function toFormState(service: Service | null): ServiceFormState {
  if (!service) {
    return {
      title: '',
      slug: '',
      short_description: '',
      description: '',
      image: '',
      sub_services: [],
      order: 0,
    };
  }

  return {
    title: service.title,
    slug: service.slug,
    short_description: service.short_description,
    description: service.description,
    image: service.image || '',
    sub_services: (service.sub_services || []).map((sub) => ({
      id: makeId(),
      title: sub.title,
      description: sub.description,
    })),
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
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleTitleChange(value: string) {
    updateField('title', value);

    if (!isEditing) {
      updateField('slug', slugify(value));
    }
  }

  function addSubService() {
    setForm((prev) => ({
      ...prev,
      sub_services: [
        ...prev.sub_services,
        { id: makeId(), title: '', description: '' },
      ],
    }));
  }

  function removeSubService(id: string) {
    setForm((prev) => ({
      ...prev,
      sub_services: prev.sub_services.filter((sub) => sub.id !== id),
    }));
  }

  function updateSubService(
    id: string,
    field: 'title' | 'description',
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      sub_services: prev.sub_services.map((sub) =>
        sub.id === id ? { ...sub, [field]: value } : sub
      ),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setIsSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      short_description: form.short_description,
      description: form.description,
      image: form.image,
      sub_services: form.sub_services.map(({ title, description }) => ({
        title,
        description,
      })),
      order: form.order,
    };

    try {
      const res = isEditing
        ? await adminApi.put<Service>(`/services/${service!.id}`, payload)
        : await adminApi.post<Service>('/services', payload);

      if (!res.data) {
        throw new Error('No data returned');
      }

      onSaved(res.data);
    } catch (err) {
      console.error('Failed to save service:', err);

      setError('Could not save service. Check the fields and try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <form
        className="admin-modal admin-modal-form admin-modal-form-large"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>{isEditing ? 'Edit Service' : 'Add Service'}</h2>
        <p className="admin-field-hint">Shown on the public Services page.</p>

        <div className="admin-field-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
        </div>

        <div className="admin-field-group">
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            required
          />
        </div>

        <div className="admin-field-group">
          <label htmlFor="short_description">Short description</label>
          <textarea
            id="short_description"
            value={form.short_description}
            onChange={(e) => updateField('short_description', e.target.value)}
            rows={2}
            required
          />
          <span className="admin-field-hint">
            Used on listing and home page cards.
          </span>
        </div>

        <div className="admin-field-group">
          <label htmlFor="description">Full description</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={5}
            required
          />
          <span className="admin-field-hint">
            Start a line with &apos;- &apos; to make it a bullet point.
          </span>
        </div>

        <div className="admin-field-group">
          <label>Service Image</label>
          <CloudinaryUpload
            value={form.image}
            onChange={(url) =>
              updateField('image', typeof url === 'string' ? url : '')
            }
            label={form.image ? 'Replace Image' : 'Upload Image'}
          />
        </div>

        <fieldset className="admin-fieldset">
          <legend>Sub-services</legend>

          <div className="admin-page-header">
            <span />
            <button
              type="button"
              onClick={addSubService}
              className="admin-button-secondary"
            >
              + Add sub-service
            </button>
          </div>

          {form.sub_services.map((sub, index) => (
            <div key={sub.id} className="admin-subservice-card">
              <div className="admin-subservice-header">
                <span className="admin-field-hint">
                  SUB-SERVICE {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeSubService(sub.id)}
                  className="admin-table-action admin-table-action-danger"
                  aria-label="Remove sub-service"
                >
                  🗑
                </button>
              </div>

              <div className="admin-field-group">
                <label htmlFor={`sub-title-${sub.id}`}>Title</label>
                <input
                  id={`sub-title-${sub.id}`}
                  value={sub.title}
                  onChange={(e) =>
                    updateSubService(sub.id, 'title', e.target.value)
                  }
                  required
                />
              </div>

              <div className="admin-field-group">
                <label htmlFor={`sub-desc-${sub.id}`}>Description</label>
                <textarea
                  id={`sub-desc-${sub.id}`}
                  value={sub.description}
                  onChange={(e) =>
                    updateSubService(sub.id, 'description', e.target.value)
                  }
                  rows={2}
                  required
                />
                <span className="admin-field-hint">
                  Start a line with &apos;- &apos; to make it a bullet point.
                </span>
              </div>
            </div>
          ))}
        </fieldset>

        <div className="admin-field-group">
          <label htmlFor="order">Display order</label>
          <input
            id="order"
            type="number"
            value={form.order}
            onChange={(e) => updateField('order', Number(e.target.value))}
          />
          <span className="admin-field-hint">Lower numbers appear first.</span>
        </div>

        {error && <p className="admin-error-text">{error}</p>}

        <div className="admin-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="admin-button-secondary"
          >
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