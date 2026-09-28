import { LoaderCircle } from "lucide-react";

export default function FullScreenLoader() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <LoaderCircle className="animate-spin text-earth" size={32} aria-label="Loading" />
    </div>
  );
}