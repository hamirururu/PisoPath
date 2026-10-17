import { RefreshCw } from "lucide-react";
import { usePwaUpdate } from "../../hooks/usePwaUpdate";

export default function UpdateBanner() {
  const { needRefresh, reloadNow, dismiss } = usePwaUpdate();

  if (!needRefresh) return null;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-center gap-3 bg-earth px-4 py-2 text-center text-xs font-medium text-cream">
      <RefreshCw size={14} />
      A new version of PisoPath is available.
      <button onClick={reloadNow} className="underline underline-offset-2">
        Update now
      </button>
      <button onClick={dismiss} aria-label="Dismiss" className="opacity-80">
        ✕
      </button>
    </div>
  );
}