import { CircleAlert } from 'lucide-react';
import type { JSX } from 'react';

interface ConfirmModalProps {
  title?: string;
  message: string;
  deleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  title = 'Konfirmasi',
  message,
  deleting = false,
  onConfirm,
  onCancel,
  confirmText = 'Hapus',
  cancelText = 'Batal',
}: ConfirmModalProps): JSX.Element {
  return (
    // Overlay modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={() => {
        if (!deleting) {
          onCancel();
        }
      }}
    >
      {/* Isi modal */}
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-500">
          <CircleAlert size={22} strokeWidth={2.2} />
        </div>

        <h2 className="mb-2 font-bold text-slate-800">{title}</h2>

        <p className="mb-6 text-sm leading-relaxed text-slate-500">{message}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 rounded-xl bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 rounded-xl bg-error py-2.5 text-sm font-semibold text-white transition hover:bg-error-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? 'Menghapus…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
