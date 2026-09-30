import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { colorForIndex } from "../../lib/palette";
import { formatPeso } from "../../utils/format";
import { Tag } from "lucide-react";

export default function BreakdownCard({ title, items, getIcon }) {
  const total = items.reduce((s, i) => s + i.total, 0);

  return (
    <Card>
      <h2 className="mb-4 font-semibold">{title}</h2>
      {items.length === 0 ? (
        <EmptyState icon={Tag} text="No data for this range." />
      ) : (
        <ul className="space-y-4">
          {items.map((item, i) => {
            const Icon = getIcon ? getIcon(item.label) : Tag;
            const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
            const color = colorForIndex(i);
            return (
              <li key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium">
                    <Icon size={16} style={{ color }} />
                    {item.label}
                  </span>
                  <span className="text-earth-dark">
                    {formatPeso(item.total)} · {pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-beige/50">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}