// components/admin/TagInputField.tsx
import { useState, KeyboardEvent, FocusEvent } from 'react';

interface TagInputFieldProps {
  id?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function TagInputField({
  id,
  values,
  onChange,
  placeholder,
}: TagInputFieldProps) {
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const trimmed = draft.trim();

    if (!trimmed) return;

    onChange([...values, trimmed]);
    setDraft('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitDraft();
      return;
    }

    if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function handleBlur(_e: FocusEvent<HTMLInputElement>) {
    commitDraft();
  }

  function removeTag(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div className="admin-tag-input">
      <div className="admin-tag-input-field">
        {values.map((tag, index) => (
          <span key={`${tag}-${index}`} className="admin-tag">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="admin-tag-remove"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={values.length === 0 ? placeholder : ''}
        />
      </div>

      <span className="admin-field-hint">Press Enter after each item.</span>
    </div>
  );
}