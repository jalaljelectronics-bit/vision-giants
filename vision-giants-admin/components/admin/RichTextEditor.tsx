// components/admin/RichTextEditor.tsx
// Placeholder implementation — swap for Tiptap once the dependency is approved.
interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <textarea
      className="admin-rich-text-placeholder"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={12}
      placeholder="Blog content (plain text for now — rich text editor pending)"
    />
  );
}