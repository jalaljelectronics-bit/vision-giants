import { useState, FormEvent } from 'react';
import type { PortfolioItem } from '@/types';
import { adminApi } from '@/lib/api';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

interface PortfolioFormModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onSaved: (item: PortfolioItem) => void;
}

interface PortfolioFormState {
  title: string;
  slug: string;
  client_name: string;
  description: string;
  images: string[];
  technologies: string;
  featured: boolean;
}

function toFormState(
  item: PortfolioItem | null
): PortfolioFormState {
  if (!item) {
    return {
      title: '',
      slug: '',
      client_name: '',
      description: '',
      images: [],
      technologies: '',
      featured: false,
    };
  }

  return {
    title: item.title,
    slug: item.slug,
    client_name: item.client_name,
    description: item.description,
    images: item.images || [],
    technologies: item.technologies.join(', '),
    featured: item.featured,
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export default function PortfolioFormModal({
  item,
  onClose,
  onSaved,
}: PortfolioFormModalProps) {
  const [form, setForm] = useState<PortfolioFormState>(
    toFormState(item)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(item);

  function updateField<K extends keyof PortfolioFormState>(
    key: K,
    value: PortfolioFormState[K]
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setIsSaving(true);

    const payload = {
      title: form.title,
      slug: form.slug,
      client_name: form.client_name,
      description: form.description,
      images: form.images,
      technologies: parseList(
        form.technologies
      ),
      featured: form.featured,
    };

    try {
      const res = isEditing
        ? await adminApi.put<PortfolioItem>(
            `/portfolio/${item!.id}`,
            payload
          )
        : await adminApi.post<PortfolioItem>(
            '/portfolio',
            payload
          );

      if (!res.data) {
        throw new Error('No data returned');
      }

      onSaved(res.data);
    } catch (err) {
      console.error(
        'Failed to save portfolio item:',
        err
      );

      setError(
        'Could not save portfolio item. Check the fields and try again.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      className="admin-modal-overlay"
      onClick={onClose}
    >
      <form
        className="admin-modal admin-modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>
          {isEditing
            ? 'Edit Portfolio Item'
            : 'Add Portfolio Item'}
        </h2>

        <label htmlFor="title">
          Title
        </label>

        <input
          id="title"
          value={form.title}
          onChange={(e) =>
            handleTitleChange(e.target.value)
          }
          required
        />

        <label htmlFor="slug">
          Slug
        </label>

        <input
          id="slug"
          value={form.slug}
          onChange={(e) =>
            updateField('slug', e.target.value)
          }
          required
        />

        <label htmlFor="client_name">
          Client Name
        </label>

        <input
          id="client_name"
          value={form.client_name}
          onChange={(e) =>
            updateField(
              'client_name',
              e.target.value
            )
          }
          required
        />

        <label htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          value={form.description}
          onChange={(e) =>
            updateField(
              'description',
              e.target.value
            )
          }
          rows={5}
          required
        />

        <label>
          Portfolio Images
        </label>

        <CloudinaryUpload
          multiple
          value={form.images}
          onChange={(urls) =>
            updateField(
              'images',
              Array.isArray(urls) ? urls : []
            )
          }
          label="Upload Images"
        />

        <label htmlFor="technologies">
          Technologies
          <span className="admin-field-hint">
            {' '}
            (comma-separated)
          </span>
        </label>

        <input
          id="technologies"
          value={form.technologies}
          onChange={(e) =>
            updateField(
              'technologies',
              e.target.value
            )
          }
          placeholder="Next.js, Node.js, PostgreSQL"
        />

        <label className="admin-checkbox-label">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              updateField(
                'featured',
                e.target.checked
              )
            }
          />

          Featured on homepage
        </label>

        {error && (
          <p className="admin-error-text">
            {error}
          </p>
        )}

        <div className="admin-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="admin-button-secondary"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="admin-button-primary"
          >
            {isSaving
              ? 'Saving…'
              : isEditing
                ? 'Save Changes'
                : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}