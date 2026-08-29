// components/admin/BlogFormModal.tsx

import { useState, FormEvent } from 'react';
import type { BlogPost } from '@/types';
import { adminApi } from '@/lib/api';
import RichTextEditor from './RichTextEditor';
import CloudinaryUpload from './CloudinaryUpload';

interface BlogFormModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: (post: BlogPost) => void;
}

interface BlogFormState {
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  meta_title: string;
  meta_description: string;
  published: boolean;
}

function toFormState(post: BlogPost | null): BlogFormState {
  if (!post) {
    return {
      title: '',
      slug: '',
      content: '',
      cover_image: '',
      meta_title: '',
      meta_description: '',
      published: false,
    };
  }

  return {
    title: post.title,
    slug: post.slug,
    content: post.content,
    cover_image: post.cover_image,
    meta_title: post.meta_title,
    meta_description: post.meta_description,
    published: post.published,
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

export default function BlogFormModal({
  post,
  onClose,
  onSaved,
}: BlogFormModalProps) {
  const [form, setForm] = useState<BlogFormState>(
    toFormState(post)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(post);

  function updateField<K extends keyof BlogFormState>(
    key: K,
    value: BlogFormState[K]
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

      if (!form.meta_title) {
        updateField('meta_title', value);
      }
    }
  }

  async function handleSubmit(
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
    publishNow?: boolean
  ) {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    const payload = {
      ...form,
      published: publishNow ?? form.published,
    };

    try {
      const res = isEditing
        ? await adminApi.put<BlogPost>(
            `/blog/${post!.id}`,
            payload
          )
        : await adminApi.post<BlogPost>(
            '/blog',
            payload
          );

      if (!res.data) {
        throw new Error('No data returned');
      }

      onSaved(res.data);
    } catch (err) {
      console.error('Failed to save blog post:', err);
      setError(
        'Could not save post. Check the fields and try again.'
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
        className="admin-modal admin-modal-form admin-modal-form-large"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => handleSubmit(e)}
      >
        <h2>
          {isEditing ? 'Edit Post' : 'New Post'}
        </h2>

        <label htmlFor="title">Title</label>

        <input
          id="title"
          value={form.title}
          onChange={(e) =>
            handleTitleChange(e.target.value)
          }
          required
        />

        <label htmlFor="slug">Slug</label>

        <input
          id="slug"
          value={form.slug}
          onChange={(e) =>
            updateField('slug', e.target.value)
          }
          required
        />

        <label>Cover Image</label>

        <CloudinaryUpload
          value={form.cover_image}
          onChange={(url) =>
            updateField(
              'cover_image',
              typeof url === 'string' ? url : ''
            )
          }
          label={form.cover_image ? 'Replace Image' : 'Upload Image'}
        />

        <label htmlFor="content">
          Content
        </label>

        <RichTextEditor
          value={form.content}
          onChange={(value) =>
            updateField('content', value)
          }
        />

        <fieldset className="admin-fieldset">
          <legend>SEO</legend>

          <div className="admin-field-group">
            <label htmlFor="meta_title">
              Meta Title
            </label>

            <input
              id="meta_title"
              value={form.meta_title}
              onChange={(e) =>
                updateField(
                  'meta_title',
                  e.target.value
                )
              }
              maxLength={60}
            />

            <span className="admin-field-hint">
              {form.meta_title.length}/60
            </span>
          </div>

          <div className="admin-field-group">
            <label htmlFor="meta_description">
              Meta Description
            </label>

            <textarea
              id="meta_description"
              value={form.meta_description}
              onChange={(e) =>
                updateField(
                  'meta_description',
                  e.target.value
                )
              }
              rows={3}
              maxLength={160}
            />

            <span className="admin-field-hint">
              {form.meta_description.length}/160
            </span>
          </div>
        </fieldset>

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
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            className="admin-button-secondary"
            onClick={(e) =>
              handleSubmit(e, false)
            }
          >
            {isSaving
              ? 'Saving…'
              : 'Save Draft'}
          </button>

          <button
            type="button"
            disabled={isSaving}
            className="admin-button-primary"
            onClick={(e) =>
              handleSubmit(e, true)
            }
          >
            {isSaving
              ? 'Publishing…'
              : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}