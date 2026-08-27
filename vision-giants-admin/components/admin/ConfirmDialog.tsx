// components/admin/ConfirmDialog.tsx
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isConfirming,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button type="button" onClick={onCancel} className="admin-button-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="admin-button-danger"
          >
            {isConfirming ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}