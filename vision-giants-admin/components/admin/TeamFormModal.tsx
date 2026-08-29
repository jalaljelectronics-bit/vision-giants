import { useState, FormEvent } from 'react';
import type { TeamMember } from '@/types';
import { adminApi } from '@/lib/api';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

interface TeamFormModalProps {
  member: TeamMember | null;
  onClose: () => void;
  onSaved: (member: TeamMember) => void;
}

interface TeamFormState {
  name: string;
  role: string;
  photo: string;
  order: number;
}

function toFormState(
  member: TeamMember | null
): TeamFormState {
  if (!member) {
    return {
      name: '',
      role: '',
      photo: '',
      order: 0,
    };
  }

  return {
    name: member.name,
    role: member.role,
    photo: member.photo || '',
    order: member.order,
  };
}

export default function TeamFormModal({
  member,
  onClose,
  onSaved,
}: TeamFormModalProps) {
  const [form, setForm] = useState<TeamFormState>(
    toFormState(member)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(member);

  function updateField<K extends keyof TeamFormState>(
    key: K,
    value: TeamFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setIsSaving(true);

    try {
      const res = isEditing
        ? await adminApi.put<TeamMember>(
            `/team/${member!.id}`,
            form
          )
        : await adminApi.post<TeamMember>(
            '/team',
            form
          );

      if (!res.data) {
        throw new Error('No data returned');
      }

      onSaved(res.data);
    } catch (err) {
      console.error(
        'Failed to save team member:',
        err
      );

      setError(
        'Could not save team member. Check the fields and try again.'
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
            ? 'Edit Team Member'
            : 'Add Team Member'}
        </h2>

        <label htmlFor="name">
          Name
        </label>

        <input
          id="name"
          value={form.name}
          onChange={(e) =>
            updateField('name', e.target.value)
          }
          required
        />

        <label htmlFor="role">
          Role
        </label>

        <input
          id="role"
          value={form.role}
          onChange={(e) =>
            updateField('role', e.target.value)
          }
          placeholder="e.g. Lead Frontend Developer"
          required
        />

        <label>
          Team Photo
        </label>

        <CloudinaryUpload
          value={form.photo}
          onChange={(url) =>
            updateField(
              'photo',
              typeof url === 'string' ? url : ''
            )
          }
          label={
            form.photo
              ? 'Replace Photo'
              : 'Upload Photo'
          }
        />

        <label htmlFor="order">
          Display Order
        </label>

        <input
          id="order"
          type="number"
          value={form.order}
          onChange={(e) =>
            updateField(
              'order',
              Number(e.target.value)
            )
          }
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