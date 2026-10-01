import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-center gap-2 bg-danger px-4 py-2 text-center text-xs font-medium text-cream">
      <WifiOff size={14} />
      You're offline. Some data may be out of date until you're back online.
    </div>
  );
}