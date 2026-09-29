import { useId } from "react";

export default function AmountField({ label = "Amount (₱)", value, onChange, error }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-earth-dark">₱</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl bg-cream py-3 pl-9 pr-4 text-base text-ink ring-1 placeholder:text-earth-dark/50 focus:outline-none focus:ring-2 focus:ring-earth ${
            error ? "ring-danger" : "ring-beige"
          }`}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}