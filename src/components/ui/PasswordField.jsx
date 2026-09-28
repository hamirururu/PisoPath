import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({ label, hint, className = "", ...props }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="w-full rounded-2xl bg-cream py-3 pl-4 pr-12 text-base text-ink ring-1 ring-beige placeholder:text-earth-dark/50 focus:outline-none focus:ring-2 focus:ring-earth"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center text-earth-dark"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs text-earth-dark">{hint}</p>}
    </div>
  );
}