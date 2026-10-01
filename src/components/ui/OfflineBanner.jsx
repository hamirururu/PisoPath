import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="sticky top-0 z-30 animate-banner-in bg-danger text-cream">
      <div className="flex items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium">
        <WifiOff size={14} className="shrink-0 animate-pulse" />
        {/* brief blink to read as "attention", not an alarm */}
        <span className="animate-banner-text">No internet connection</span>
      </div>
    </div>
  );
}