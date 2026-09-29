import { PieChart } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { getCategoryIcon } from "../../lib/categoryIcons";
import { colorForIndex } from "../../lib/palette";
import { formatPeso } from "../../utils/format";

export default function CategoryBreakdown({ data }) {
  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <Card>
      <h2 className="mb-4 font-semibold">Spending by category (this month)</h2>
      {data.length === 0 ? (
        <EmptyState icon={PieChart} text="No expenses recorded this month yet." />
      ) : (
        <ul className="space-y-4">
          {data.map((item, i) => {
            const Icon = getCategoryIcon(item.category);
            const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
            const color = colorForIndex(i);
            return (
              <li key={item.category}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Icon size={16} style={{ color }} />
                    {item.category}
                  </span>
                  <span className="text-earth-dark">
                    {formatPeso(item.total)} · {pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-beige/50">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}