import { useEffect, useRef, useState, FormEvent } from 'react';
import type { PortfolioItem, Service } from '@/types';
import { adminApi } from '@/lib/api';

interface PortfolioFormModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  onSaved: (item: PortfolioItem) => void;
}

interface PortfolioFormState {
  title: string;
  slug: string;
  project_url: string;
  related_service_id: number | null;
  cover_image: string;
  technologies: string;
  challenge: string;
  solution: string;
  result: string;
  featured: boolean;
  is_new_arrival: boolean;
  is_draft: boolean;
}

function toFormState(
  item: PortfolioItem | null
): PortfolioFormState {
  if (!item) {
    return {
      title: '',
      slug: '',
      project_url: '',
      related_service_id: null,
      cover_image: '',
      technologies: '',
      challenge: '',
      solution: '',
      result: '',
      featured: false,
      is_new_arrival: false,
      is_draft: false,
    };
  }

  return {
    title: item.title,
    slug: item.slug,
    project_url: item.project_url,
    related_service_id: item.related_service_id ?? null,
    cover_image: item.cover_image || '',
    technologies: item.technologies.join(', '),
    challenge: item.challenge,
    solution: item.solution,
    result: item.result,
    featured: item.featured,
    is_new_arrival: item.is_new_arrival,
    is_draft: item.is_draft,
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

// ---------- Local component: CoverImageUpload ----------
interface CloudinaryResult {
  secure_url: string;
}

interface CloudinaryWidget {
  open: () => void;
}

interface Cloudinary {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (
      error: unknown,
      result: {
        event?: string;
        info?: CloudinaryResult;
      }
    ) => void
  ) => CloudinaryWidget;
}

declare global {
  interface Window {
    cloudinary?: Cloudinary;
  }
}

interface CoverImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

function CoverImageUpload({ value, onChange }: CoverImageUploadProps) {
  const widgetRef = useRef<CloudinaryWidget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState('');

  function loadCloudinaryScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.cloudinary) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://upload-widget.cloudinary.com/global/all.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () =>
          reject(new Error('Could not load Cloudinary'))
        );
        return;
      }

      const script = document.createElement('script');

      script.src =
        'https://upload-widget.cloudinary.com/global/all.js';

      script.async = true;

      script.onload = () => resolve();

      script.onerror = () =>
        reject(new Error('Could not load Cloudinary'));

      document.body.appendChild(script);
    });
  }

  async function openWidget() {
    setError(null);
    setIsLoading(true);

    try {
      await loadCloudinaryScript();

      if (!window.cloudinary) {
        throw new Error('Cloudinary failed to initialize');
      }

      if (!widgetRef.current) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: 'r2fk1fws',
            uploadPreset: 'vision_giants',

            multiple: false,
            maxFiles: 1,

            sources: ['local', 'url', 'camera'],

            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
            maxImageFileSize: 10000000,

            cropping: false,
            showSkipCropButton: false,

            folder: 'vision-giants',

            styles: {
              palette: {
                window: '#ffffff',
                windowBorder: '#d9d9d9',
                tabIcon: '#111111',
                menuIcons: '#555555',
                textDark: '#111111',
                textLight: '#ffffff',
                link: '#111111',
                action: '#111111',
                inactiveTabIcon: '#999999',
                error: '#c62828',
                inProgress: '#555555',
                complete: '#2e7d32',
                sourceBg: '#f7f7f7',
              },
            },
          },
          (uploadError, result) => {
            if (uploadError) {
              console.error('Cloudinary upload error:', uploadError);
              setError('Image upload failed. Please try again.');
              setIsLoading(false);
              return;
            }

            if (
              result.event === 'success' &&
              result.info?.secure_url
            ) {
              onChange(result.info.secure_url);
              setIsLoading(false);
            }

            if (result.event === 'close') {
              setIsLoading(false);
            }
          }
        );
      }

      widgetRef.current.open();
    } catch (err) {
      console.error(err);
      setError('Could not open Cloudinary uploader.');
      setIsLoading(false);
    }
  }

  function addUrl() {
    const trimmed = urlDraft.trim();

    if (!trimmed) return;

    onChange(trimmed);
    setUrlDraft('');
  }

  return (
    <div className="admin-cover-upload">
      <div className="admin-cover-dropzone">
        {value ? (
          <img
            src={value}
            alt="Cover preview"
            className="admin-cover-dropzone-image"
          />
        ) : (
          <span className="admin-cover-dropzone-placeholder">🖼</span>
        )}
      </div>

      <button
        type="button"
        onClick={openWidget}
        disabled={isLoading}
        className="admin-button-secondary admin-cover-upload-button"
      >
        {isLoading ? 'Uploading…' : `⬆ ${value ? 'Replace Image' : 'Upload image'}`}
      </button>

      <div className="admin-cover-url-row">
        <input
          type="text"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          placeholder="Paste image URL"
        />

        <button
          type="button"
          onClick={addUrl}
          className="admin-button-secondary"
        >
          Add
        </button>
      </div>

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="admin-cover-remove"
        >
          Remove image
        </button>
      )}

      {error && <p className="admin-error-text">{error}</p>}
    </div>
  );
}

// ---------- Local component: ToggleSwitch ----------
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="admin-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="admin-toggle-input"
      />

      <span className="admin-toggle-track">
        <span className="admin-toggle-thumb" />
      </span>

      <span className="admin-toggle-label">{label}</span>
    </label>
  );
}

// ---------- Main component: PortfolioFormModal ----------

export default function PortfolioFormModal({
  item,
  onClose,
  onSaved,
}: PortfolioFormModalProps) {
  const [form, setForm] = useState<PortfolioFormState>(
    toFormState(item)
  );

  const [services, setServices] = useState<Service[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(item);

  useEffect(() => {
    adminApi
      .get<Service[]>('/services')
      .then((res) => setServices(res.data ?? []))
      .catch(() => setServices([]));
  }, []);

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

    const payload = {
      title: form.title,
      slug: form.slug,
      project_url: form.project_url,
      related_service_id: form.related_service_id,
      cover_image: form.cover_image,
      technologies: parseList(form.technologies),
      challenge: form.challenge,
      solution: form.solution,
      result: form.result,
      featured: form.featured,
      is_new_arrival: form.is_new_arrival,
      is_draft: form.is_draft,
    };

    if (
      !payload.title ||
      !payload.project_url ||
      !payload.cover_image ||
      !payload.challenge ||
      !payload.solution ||
      !payload.result
    ) {
      setError('Please complete all required fields.');
      return;
    }

    setIsSaving(true);

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

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label htmlFor="title">
              Project title <span className="admin-required">*</span>
            </label>

            <input
              id="title"
              value={form.title}
              onChange={(e) =>
                handleTitleChange(e.target.value)
              }
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="project_url">
              Project URL <span className="admin-required">*</span>
            </label>

            <input
              id="project_url"
              type="url"
              value={form.project_url}
              onChange={(e) =>
                updateField(
                  'project_url',
                  e.target.value
                )
              }
              placeholder="https://client-site.com"
              required
            />
          </div>
        </div>

        <label htmlFor="related_service">
          Related service
        </label>

        <select
          id="related_service"
          value={form.related_service_id ?? ''}
          onChange={(e) =>
            updateField(
              'related_service_id',
              e.target.value ? Number(e.target.value) : null
            )
          }
        >
          <option value="">— None —</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.title}
            </option>
          ))}
        </select>

        <span className="admin-field-hint">Optional</span>

        <label>
          Cover image <span className="admin-required">*</span>
        </label>

        <CoverImageUpload
          value={form.cover_image}
          onChange={(url) => updateField('cover_image', url)}
        />

        <label htmlFor="technologies">
          Technologies used
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
          placeholder="e.g. React, Node.js…"
        />

        <label htmlFor="challenge">
          Challenge <span className="admin-required">*</span>
        </label>

        <textarea
          id="challenge"
          className="admin-description-textarea admin-portfolio-textarea"
          value={form.challenge}
          onChange={(e) =>
            updateField('challenge', e.target.value)
          }
          rows={4}
          required
        />

        <label htmlFor="solution">
          Solution <span className="admin-required">*</span>
        </label>

        <textarea
          id="solution"
          className="admin-description-textarea admin-portfolio-textarea"
          value={form.solution}
          onChange={(e) =>
            updateField('solution', e.target.value)
          }
          rows={4}
          required
        />

        <label htmlFor="result">
          Result / outcomes <span className="admin-required">*</span>
        </label>

        <textarea
          id="result"
          className="admin-description-textarea admin-portfolio-textarea"
          value={form.result}
          onChange={(e) =>
            updateField('result', e.target.value)
          }
          rows={4}
          required
        />

        <div className="admin-toggle-row">
          <ToggleSwitch
            label="Featured"
            checked={form.featured}
            onChange={(checked) =>
              updateField('featured', checked)
            }
          />

          <ToggleSwitch
            label="New Arrival"
            checked={form.is_new_arrival}
            onChange={(checked) =>
              updateField('is_new_arrival', checked)
            }
          />

          <ToggleSwitch
            label="Draft"
            checked={form.is_draft}
            onChange={(checked) =>
              updateField('is_draft', checked)
            }
          />
        </div>

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
            type="submit"
            disabled={isSaving}
            className="admin-button-primary"
          >
            {isSaving
              ? 'Saving…'
              : isEditing
                ? ' Save Changes'
                : ' Create project'}
          </button>
        </div>
      </form>
    </div>
  );
}