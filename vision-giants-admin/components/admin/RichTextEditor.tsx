// components/admin/RichTextEditor.tsx
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
      rows={16}
      placeholder={'Paste or write your post in Markdown:\n\n# Heading\n**bold**, *italic*\n- list item\n[link](https://example.com)\n![alt text](https://image-url.com)'}
    />
  );
}