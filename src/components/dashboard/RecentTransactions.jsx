import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { getExpenseDisplay } from "../../lib/expenseDisplay";
import { formatPeso, formatShortDate, formatTime } from "../../utils/format";

export default function RecentTransactions({ items }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Recent transactions</h2>
        <Link to="/history" className="text-sm font-medium text-earth-dark underline">
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Receipt} text="No expenses yet. Add your first one to see it here." />
      ) : (
        <ul className="divide-y divide-beige/60">
          {items.map((expense) => {
            const { title, subtitle, Icon } = getExpenseDisplay(expense);
            return (
              <li key={expense.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-beige/50 text-earth-dark">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{title}</p>
                  {subtitle && <p className="truncate text-xs text-earth-dark">{subtitle}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">{formatPeso(expense.amount)}</p>
                  <p className="text-xs text-earth-dark">
                    {formatShortDate(expense.expense_date)} · {formatTime(expense.expense_time)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}