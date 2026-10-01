import { useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import AmountField from "../forms/AmountField";
import Button from "../ui/Button";

export default function BudgetFormDialog({ open, label, initialAmount, onSave, onCancel }) {
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
    const numeric = Number(amount);
    if (!amount || numeric <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(numeric);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-3xl bg-paper p-5 shadow-xl sm:rounded-3xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">{label}</h2>
          <button onClick={onCancel} aria-label="Close" className="grid size-8 place-items-center rounded-full text-earth-dark hover:bg-beige/50">
            <X size={18} />
          </button>
        </div>
        <AmountField label="Monthly budget (₱)" value={amount} onChange={(e) => setAmount(e.target.value)} error={error} />
        <div className="mt-5 flex gap-3">
          <Button variant="soft" className="flex-1" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleSave} disabled={saving}>
            {saving && <LoaderCircle size={16} className="animate-spin" />}
            {saving ? "Saving…" : "Save budget"}
          </Button>
        </div>
      </div>
    </div>
  );
}