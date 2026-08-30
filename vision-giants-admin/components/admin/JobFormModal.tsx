// components/admin/JobFormModal.tsx

import { useState, FormEvent } from 'react';
import type { JobPosting } from '@/types';
import { adminApi } from '@/lib/api';
import TagInputField from './TagInputField';

interface JobFormModalProps {
  job: JobPosting | null;
  onClose: () => void;
  onSaved: (job: JobPosting) => void;
}

type JobStatus = 'Open' | 'Closed';

interface JobFormState {
  title: string;
  slug: string;
  department: string;
  location: string;
  type: string;
  experience_level: string;
  status: JobStatus;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
];

const STATUS_OPTIONS: JobStatus[] = ['Open', 'Closed'];

function toFormState(job: JobPosting | null): JobFormState {
  if (!job) {
    return {
      title: '',
      slug: '',
      department: '',
      location: '',
      type: JOB_TYPES[0],
      experience_level: '',
      status: 'Open',
      description: '',
      requirements: [],
      responsibilities: [],
    };
  }

  return {
    title: job.title ?? '',
    slug: job.slug ?? '',
    department: job.department ?? '',
    location: job.location ?? '',
    type: job.type ?? JOB_TYPES[0],
    experience_level: job.experience_level ?? '',
    status: job.is_active ? 'Open' : 'Closed',
    description: job.description ?? '',
    requirements: job.requirements ?? [],
    responsibilities: job.responsibilities ?? [],
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function JobFormModal({
  job,
  onClose,
  onSaved,
}: JobFormModalProps) {
  const [form, setForm] = useState<JobFormState>(
    toFormState(job)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(job);

  function updateField<K extends keyof JobFormState>(
    key: K,
    value: JobFormState[K]
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        type: form.type,
        experience_level: form.experience_level.trim(),
        description: form.description.trim(),
        requirements: form.requirements,
        responsibilities: form.responsibilities,
        is_active: form.status === 'Open',
      };

      if (
        !payload.title ||
        !payload.slug ||
        !payload.department ||
        !payload.location ||
        !payload.experience_level ||
        !payload.description ||
        payload.requirements.length === 0 ||
        payload.responsibilities.length === 0
      ) {
        throw new Error(
          'Please complete all required fields.'
        );
      }

      const res = isEditing
        ? await adminApi.put<JobPosting>(
            `/jobs/${job!.id}`,
            payload
          )
        : await adminApi.post<JobPosting>(
            '/jobs',
            payload
          );

      if (!res.success || !res.data) {
        throw new Error(
          res.error ?? 'Could not save job posting.'
        );
      }

      onSaved(res.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not save job posting. Check the fields and try again.'
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
            ? 'Edit Job Posting'
            : 'New Job Posting'}
        </h2>

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="title">
              Job title <span className="admin-required">*</span>
            </label>

            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) =>
                handleTitleChange(e.target.value)
              }
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="department">
              Department <span className="admin-required">*</span>
            </label>

            <input
              id="department"
              type="text"
              value={form.department}
              onChange={(e) =>
                updateField('department', e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="location">
              Location <span className="admin-required">*</span>
            </label>

            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) =>
                updateField('location', e.target.value)
              }
              placeholder="e.g. Remote, Lahore, PK"
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="type">
              Employment type
            </label>

            <select
              id="type"
              value={form.type}
              onChange={(e) =>
                updateField('type', e.target.value)
              }
            >
              {JOB_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="experience_level">
              Experience level <span className="admin-required">*</span>
            </label>

            <input
              id="experience_level"
              type="text"
              value={form.experience_level}
              onChange={(e) =>
                updateField('experience_level', e.target.value)
              }
              placeholder="e.g. Mid, Senior"
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              value={form.status}
              onChange={(e) =>
                updateField('status', e.target.value as JobStatus)
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label htmlFor="description">
          Job description <span className="admin-required">*</span>
        </label>

        <textarea
          id="description"
          className="admin-description-textarea"
          value={form.description}
          onChange={(e) =>
            updateField('description', e.target.value)
          }
          rows={6}
          required
        />

        <label htmlFor="requirements">
          Requirements <span className="admin-required">*</span>
        </label>

        <TagInputField
          id="requirements"
          values={form.requirements}
          onChange={(values) => updateField('requirements', values)}
          placeholder="e.g. 3+ years with React"
        />

        <label htmlFor="responsibilities">
          Responsibilities <span className="admin-required">*</span>
        </label>

        <TagInputField
          id="responsibilities"
          values={form.responsibilities}
          onChange={(values) => updateField('responsibilities', values)}
          placeholder="e.g. Own the frontend architecture"
        />

        {error && (
          <p className="admin-error-text">
            {error}
          </p>
        )}

        <div className="admin-modal-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
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
                ? '💾 Save Changes'
                : '💾 Post job'}
          </button>
        </div>
      </form>
    </div>
  );
}