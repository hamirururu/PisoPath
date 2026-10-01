import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { Bus } from "lucide-react";
import { getTransportIcon } from "../../lib/categoryIcons";
import { formatPeso, formatShortDate, formatTime } from "../../utils/format";

export default function TransportHistoryList({ items, detailOf, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <Card>
        <EmptyState icon={Bus} text="No transportation expenses match your filters." />
      </Card>
    );
  }

  return (
    <div className="divide-y divide-beige/60 rounded-3xl bg-paper shadow-sm ring-1 ring-beige/70">
      {items.map((expense) => {
        const detail = detailOf(expense);
        const Icon = getTransportIcon(detail?.transportation_type);
        return (
          <div key={expense.id} className="flex items-center gap-3 p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-beige/50 text-earth-dark">
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{detail?.transportation_type}</p>
              <p className="truncate text-xs text-earth-dark">
                {detail?.starting_point} → {detail?.destination}
              </p>
              <p className="text-xs text-earth-dark">
                {formatShortDate(expense.expense_date)} · {formatTime(expense.expense_time)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="mb-1 text-sm font-semibold">{formatPeso(expense.amount)}</p>
              <div className="flex gap-2 text-xs">
                <button onClick={() => onEdit(expense)} className="font-medium text-earth-dark underline">
                  Edit
                </button>
                <button onClick={() => onDelete(expense)} className="font-medium text-danger underline">
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}