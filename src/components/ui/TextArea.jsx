import { useId } from "react";

export default function TextArea({ label, className = "", ...props }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        className="w-full resize-none rounded-2xl bg-cream px-4 py-3 text-base text-ink ring-1 ring-beige placeholder:text-earth-dark/50 focus:outline-none focus:ring-2 focus:ring-earth"
        {...props}
      />
    </div>
  );
}