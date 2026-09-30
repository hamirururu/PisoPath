import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import YTick from "../ui/YTick";
import { TrendingUp } from "lucide-react";
import { formatPeso } from "../../utils/format";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-ink px-3 py-2 text-xs text-cream shadow-lg">
      <p className="font-medium">{label}</p>
      <p>{formatPeso(payload[0].value)}</p>
    </div>
  );
}

export default function SpendingTrendChart({ series, granularity }) {
  const hasData = series.some((s) => s.total > 0);

  return (
    <Card>
      <h2 className="mb-4 font-semibold">
        Spending trend {granularity === "monthly" ? "(by month)" : "(by day)"}
      </h2>
      {!hasData ? (
        <EmptyState icon={TrendingUp} text="No expenses in this range yet." />
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DBCEA5" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6B5A3B" }}
                axisLine={{ stroke: "#DBCEA5" }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={<YTick />}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8A7650"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#8A7650" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}