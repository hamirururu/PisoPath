import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../ui/Card";
import YTick from "../ui/YTick";
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

export default function DailySpendingChart({ data }) {
  return (
    <Card>
      <h2 className="mb-4 font-semibold">Last 7 days</h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DBCEA5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: "#6B5A3B" }}
              axisLine={{ stroke: "#DBCEA5" }}
              tickLine={false}
            />
            <YAxis
              tick={<YTick />}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "#DBCEA5", opacity: 0.3 }} />
            <Bar dataKey="total" fill="#8A7650" radius={[8, 8, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}