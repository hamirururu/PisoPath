import Logo from "./Logo";
import { APP_NAME } from "../../lib/navigation";

export default function SplashScreen({ message = "Loading your expenses…" }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size={96} rounded="rounded-[20px]" className="shadow-md" />
        <p className="text-lg font-semibold">{APP_NAME}</p>
        <div className="mt-1 flex items-center gap-2 text-sm text-earth-dark">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-earth opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-earth" />
          </span>
          {message}
        </div>
      </div>
    </div>
  );
}