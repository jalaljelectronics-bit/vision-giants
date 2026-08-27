// components/admin/TestimonialFormModal.tsx
import { useState, FormEvent } from 'react';
import type { Testimonial } from '@/types';
import { adminApi } from '@/lib/api';

interface TestimonialFormModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  onSaved: (testimonial: Testimonial) => void;
}

interface TestimonialFormState {
  client_name: string;
  client_company: string;
  content: string;
  rating: number;
  photo: string;
}

function toFormState(testimonial: Testimonial | null): TestimonialFormState {
  if (!testimonial) {
    return { client_name: '', client_company: '', content: '', rating: 5, photo: '' };
  }
  return {
    client_name: testimonial.client_name,
    client_company: testimonial.client_company,
    content: testimonial.content,
    rating: testimonial.rating,
    photo: testimonial.photo,
  };
}

export default function TestimonialFormModal({
  testimonial,
  onClose,
  onSaved,
}: TestimonialFormModalProps) {
  const [form, setForm] = useState<TestimonialFormState>(toFormState(testimonial));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(testimonial);

  function updateField<K extends keyof TestimonialFormState>(
    key: K,
    value: TestimonialFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const res = isEditing
        ? await adminApi.put<Testimonial>(`/admin/testimonials/${testimonial!.id}`, form)
        : await adminApi.post<Testimonial>('/admin/testimonials', form);

      if (!res.data) throw new Error('No data returned');
      onSaved(res.data);
    } catch {
      setError('Could not save testimonial. Check the fields and try again.');
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
        <h2>{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h2>

        <label htmlFor="client_name">Client Name</label>
        <input
          id="client_name"
          value={form.client_name}
          onChange={(e) => updateField('client_name', e.target.value)}
          required
        />

        <label htmlFor="client_company">Client Company</label>
        <input
          id="client_company"
          value={form.client_company}
          onChange={(e) => updateField('client_company', e.target.value)}
        />

        <label htmlFor="content">Testimonial</label>
        <textarea
          id="content"
          value={form.content}
          onChange={(e) => updateField('content', e.target.value)}
          rows={4}
          required
        />

        <label htmlFor="rating">Rating (1–5)</label>
        <input
          id="rating"
          type="number"
          min={1}
          max={5}
          value={form.rating}
          onChange={(e) => updateField('rating', Number(e.target.value))}
          required
        />

        <label htmlFor="photo">
          Photo URL <span className="admin-field-hint">(Cloudinary widget planned)</span>
        </label>
        <input
          id="photo"
          value={form.photo}
          onChange={(e) => updateField('photo', e.target.value)}
          placeholder="https://res.cloudinary.com/..."
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