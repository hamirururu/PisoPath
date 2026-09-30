import { getExpenseDisplay } from "../../lib/expenseDisplay";
import { formatPeso, formatTime } from "../../utils/format";

export default function ExpenseGroup({ dateLabel, items, dayTotal, onEdit, onDelete }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-earth-dark">{dateLabel}</h3>
        <span className="text-sm font-semibold">{formatPeso(dayTotal)}</span>
      </div>
      <div className="divide-y divide-beige/60 rounded-3xl bg-paper shadow-sm ring-1 ring-beige/70">
        {items.map((expense) => {
          const { title, subtitle, Icon } = getExpenseDisplay(expense);
          return (
            <div key={expense.id} className="flex items-center gap-3 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-beige/50 text-earth-dark">
                <Icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{title}</p>
                {subtitle && <p className="truncate text-xs text-earth-dark">{subtitle}</p>}
                <p className="text-xs text-earth-dark">{formatTime(expense.expense_time)}</p>
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
    </div>
  );
}