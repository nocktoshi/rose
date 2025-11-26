/**
 * ConfirmModal - Reusable confirmation dialog
 */

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'default';
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'var(--color-modal-overlay)' }}
        onClick={onCancel}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
        <div
          className="rounded-xl p-6 flex flex-col gap-4 max-w-[325px] w-full"
          style={{ backgroundColor: 'var(--color-bg)' }}
          onClick={e => e.stopPropagation()}
        >
          <h3
            className="m-0 text-base font-medium leading-[22px] tracking-[0.16px]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {title}
          </h3>
          <p
            className="m-0 text-sm leading-[18px] tracking-[0.14px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {message}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-12 rounded-lg text-sm font-medium leading-[18px] tracking-[0.14px] transition-opacity hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface-800)',
                color: 'var(--color-text-primary)',
              }}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-12 rounded-lg text-sm font-medium leading-[18px] tracking-[0.14px] transition-opacity hover:opacity-90"
              style={{
                backgroundColor: variant === 'danger' ? 'var(--color-red)' : 'var(--color-primary)',
                color: variant === 'danger' ? '#fff' : '#000',
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
