import { useState } from "react";
import { CalendarRange, LoaderCircle, Receipt, TrendingUp, Wallet } from "lucide-react";
import Alert from "../components/ui/Alert";
import RangeFilter from "../components/reports/RangeFilter";
import SpendingTrendChart from "../components/reports/SpendingTrendChart";
import BreakdownCard from "../components/reports/BreakdownCard";
import SummaryCard from "../components/dashboard/SummaryCard";
import { buildPresetRanges } from "../lib/reportRanges";
import { useReportsData } from "../hooks/useReportsData";
import { getCategoryIcon, getTransportIcon } from "../lib/categoryIcons";
import { formatDateByPreference, formatPeso } from "../utils/format";
import { useAuth } from "../hooks/useAuth";

export default function Reports() {
  const { user } = useAuth();
  const dateFormat = user?.user_metadata?.date_format || "long";
  const [range, setRange] = useState(buildPresetRanges()[1]); // default: This month
  const { report, loading, error } = useReportsData(range);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>

      <RangeFilter range={range} onChange={setRange} />

      {error && <Alert variant="error">{error}</Alert>}

      {loading || !report ? (
        <div className="flex justify-center py-16 text-earth-dark">
          <LoaderCircle className="animate-spin" size={28} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryCard label="Total spent" amount={formatPeso(report.totalSpent)} icon={Wallet} emphasis />
            <SummaryCard label="Transactions" amount={String(report.totalTransactions)} icon={Receipt} />
            <SummaryCard label="Avg. per day" amount={formatPeso(report.averageDaily)} icon={TrendingUp} />
            <SummaryCard
              label="Highest day"
              amount={report.highestDay ? formatPeso(report.highestDay.total) : "—"}
              icon={CalendarRange}
            />
          </div>
          {report.highestDay && (
            <p className="-mt-3 text-xs text-earth-dark">
              Highest spending day: {formatDateByPreference(report.highestDay.date, dateFormat)}
            </p>
          )}

          <SpendingTrendChart series={report.series} granularity={report.granularity} />

          <div className="grid gap-4 lg:grid-cols-3">
            <BreakdownCard
              title="By category"
              items={report.categoryBreakdown}
              getIcon={getCategoryIcon}
            />
            <BreakdownCard
              title="Transportation"
              items={report.transportationBreakdown}
              getIcon={getTransportIcon}
            />
            <BreakdownCard
              title="Food"
              items={report.foodBreakdown}
              getIcon={() => getCategoryIcon("Food")}
            />
          </div>
        </>
      )}
    </section>
  );
}