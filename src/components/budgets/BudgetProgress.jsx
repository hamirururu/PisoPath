import { formatPeso } from "../../utils/format";

export default function BudgetProgress({ label, spent, budget, icon: Icon, onEdit, onDelete }) {
  const hasBudget = budget != null;
  const pct = hasBudget && budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const remaining = hasBudget ? budget - spent : null;
  const over = hasBudget && spent > budget;
  const nearLimit = hasBudget && !over && pct >= 80;

  const barColor = over ? "#9B4A34" : nearLimit ? "#C9A24B" : "#8E977D";

  return (
    <div className="rounded-2xl bg-paper p-4 ring-1 ring-beige/70">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-earth-dark" />}
          <p className="text-sm font-semibold">{label}</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button onClick={onEdit} className="font-medium text-earth-dark underline">
            {hasBudget ? "Edit" : "Set budget"}
          </button>
          {hasBudget && (
            <button onClick={onDelete} className="font-medium text-danger underline">
              Remove
            </button>
          )}
        </div>
      </div>

      {hasBudget ? (
        <>
          <div className="mb-1.5 flex items-center justify-between text-xs text-earth-dark">
            <span>{formatPeso(spent)} spent</span>
            <span>{formatPeso(budget)} budget</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-beige/50">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
          <p className={`mt-1.5 text-xs font-medium ${over ? "text-danger" : "text-earth-dark"}`}>
            {over
              ? `Over budget by ${formatPeso(Math.abs(remaining))}`
              : `${formatPeso(remaining)} remaining · ${pct}% used`}
          </p>
        </>
      ) : (
        <p className="text-xs text-earth-dark">
          {formatPeso(spent)} spent so far. No budget set for this category.
        </p>
      )}
    </div>
  );
}