import Logo from "./Logo";
import Spinner from "./Spinner";
import { APP_NAME } from "../../lib/navigation";

export default function SplashScreen({ message = "Loading your expenses…" }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-cream px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Logo size={96} rounded="rounded-[20px]" className="shadow-md" />
        <p className="text-lg font-semibold">{APP_NAME}</p>
        <Spinner size={36} />
        <p className="text-sm text-earth-dark">{message}</p>
      </div>
    </div>
  );
}