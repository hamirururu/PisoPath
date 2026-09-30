import { LoaderCircle, TriangleAlert, X } from "lucide-react";
import Button from "./Button";

export default function ConfirmDialog({
  open, title, message, confirmLabel = "Delete", loading, onConfirm, onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-3xl bg-paper p-5 shadow-xl sm:rounded-3xl">
        <div className="mb-3 flex items-start justify-between">
          <span className="grid size-10 place-items-center rounded-2xl bg-danger-soft text-danger">
            <TriangleAlert size={20} />
          </span>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-full text-earth-dark hover:bg-beige/50"
          >
            <X size={18} />
          </button>
        </div>
        <h2 className="mb-1 font-semibold">{title}</h2>
        <p className="mb-5 text-sm text-earth-dark">{message}</p>
        <div className="flex gap-3">
          <Button variant="soft" className="flex-1" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-danger px-5 py-3 text-sm font-semibold text-cream transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}