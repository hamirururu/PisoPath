import { Wallet } from "lucide-react";
import Card from "../components/ui/Card";
import { APP_NAME } from "../lib/navigation";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 grid size-14 place-items-center rounded-3xl bg-earth text-cream shadow-sm">
            <Wallet size={26} />
          </span>
          <p className="text-sm font-semibold text-earth-dark">{APP_NAME}</p>
          <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-earth-dark">{subtitle}</p>}
        </div>
        <Card className="p-6">{children}</Card>
        {footer && <p className="mt-5 text-center text-sm text-earth-dark">{footer}</p>}
      </div>
    </div>
  );
}