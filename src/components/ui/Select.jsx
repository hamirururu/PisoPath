import { useId } from "react";
import { ChevronDown } from "lucide-react";

export default function Select({ label, hint, className = "", children, ...props }) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className="w-full appearance-none rounded-2xl bg-cream px-4 py-3 pr-10 text-base text-ink ring-1 ring-beige focus:outline-none focus:ring-2 focus:ring-earth"
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-earth-dark"
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-earth-dark">{hint}</p>}
    </div>
  );
}