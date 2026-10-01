import { RefreshCw, X } from "lucide-react";
import { usePwaUpdate } from "../../hooks/usePwaUpdate";

// Rendered app-wide. The service worker downloads a new version in the
// background, so we only interrupt once it is actually ready to be applied.
export default function UpdatePrompt() {
  const { needRefresh, reloadNow, dismiss } = usePwaUpdate();

  if (!needRefresh) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] lg:left-64 lg:pb-6">
      <div
        role="status"
        className="animate-banner-in mx-auto flex max-w-md items-center gap-3 rounded-3xl bg-ink p-3 pl-4 text-cream shadow-lg"
      >
        <RefreshCw size={18} className="shrink-0 animate-spin" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Update available</p>
          <p className="truncate text-xs text-cream/70">Reload to get the latest version.</p>
        </div>
        <button
          onClick={reloadNow}
          className="shrink-0 rounded-2xl bg-earth px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-earth-dark"
        >
          Reload
        </button>
        <button
          onClick={dismiss}
          aria-label="Dismiss update notice"
          className="grid size-8 shrink-0 place-items-center rounded-full text-cream/70 hover:bg-cream/10"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}