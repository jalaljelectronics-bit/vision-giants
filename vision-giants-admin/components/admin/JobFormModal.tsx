// components/admin/JobFormModal.tsx
import { useState, FormEvent } from 'react';
import type { JobPosting } from '@/types';
import { adminApi } from '@/lib/api';

interface JobFormModalProps {
  job: JobPosting | null;
  onClose: () => void;
  onSaved: (job: JobPosting) => void;
}

interface JobFormState {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  is_active: boolean;
}

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];

function toFormState(job: JobPosting | null): JobFormState {
  if (!job) {
    return {
      title: '',
      slug: '',
      department: '',
      location: '',
      type: JOB_TYPES[0],
      description: '',
      requirements: '',
      is_active: true,
    };
  }
  return {
    title: job.title,
    slug: job.slug,
    department: job.department,
    location: job.location,
    type: job.type,
    description: job.description,
    requirements: job.requirements,
    is_active: job.is_active,
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function JobFormModal({ job, onClose, onSaved }: JobFormModalProps) {
  const [form, setForm] = useState<JobFormState>(toFormState(job));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(job);

  function updateField<K extends keyof JobFormState>(key: K, value: JobFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
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

    try {
      const res = isEditing
        ? await adminApi.put<JobPosting>(`/admin/jobs/${job!.id}`, form)
        : await adminApi.post<JobPosting>('/admin/jobs', form);

      if (!res.data) throw new Error('No data returned');
      onSaved(res.data);
    } catch {
      setError('Could not save job posting. Check the fields and try again.');
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
        <h2>{isEditing ? 'Edit Job Posting' : 'New Job Posting'}</h2>

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

        <label htmlFor="department">Department</label>
        <input
          id="department"
          value={form.department}
          onChange={(e) => updateField('department', e.target.value)}
          placeholder="e.g. Engineering"
          required
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          value={form.location}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="e.g. Remote, Karachi"
          required
        />

        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={form.type}
          onChange={(e) => updateField('type', e.target.value)}
        >
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
          required
        />

        <label htmlFor="requirements">Requirements</label>
        <textarea
          id="requirements"
          value={form.requirements}
          onChange={(e) => updateField('requirements', e.target.value)}
          rows={4}
          placeholder="One requirement per line"
          required
        />

        <label className="admin-checkbox-label">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => updateField('is_active', e.target.checked)}
          />
          Active (visible on public careers page)
        </label>

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