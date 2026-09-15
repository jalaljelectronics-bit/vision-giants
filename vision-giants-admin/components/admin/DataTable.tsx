// components/admin/DataTable.tsx
import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode; // custom cell renderer; defaults to row[key]
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  editLabel?: string;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function DataTable<T extends { id: number }>({
  columns,
  rows,
  isLoading,
  emptyMessage = 'No records found.',
  editLabel = 'Edit',
  onEdit,
  onView,
  onDelete,
}: DataTableProps<T>) {
  if (isLoading) {
    return <p className="admin-table-loading">Loading…</p>;
  }

  if (rows.length === 0) {
    return <p className="admin-table-empty">{emptyMessage}</p>;
  }

  const hasActions = Boolean(onEdit || onView || onDelete);

  return (
    <table className="admin-data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.header}</th>
          ))}
          {hasActions && <th className="admin-table-actions-col">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
              </td>
            ))}
            {hasActions && (
              <td className="admin-table-actions-col">
                {onView && (
                  <button type="button" onClick={() => onView(row)} className="admin-table-action" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    View
                  </button>
                )}
                {onEdit && (
                  <button type="button" onClick={() => onEdit(row)} className="admin-table-action">
                    {editLabel}
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(row)}
                    className="admin-table-action admin-table-action-danger"
                  >
                    Delete
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}