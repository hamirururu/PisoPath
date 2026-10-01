import { CalendarDays, Wallet } from "lucide-react";
import SummaryCard from "../dashboard/SummaryCard";
import { formatPeso } from "../../utils/format";

export default function TransportSummaryCards({ totals }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <SummaryCard label="Today" amount={formatPeso(totals.today)} icon={CalendarDays} emphasis />
      <SummaryCard label="This week" amount={formatPeso(totals.week)} icon={CalendarDays} />
      <SummaryCard label="This month" amount={formatPeso(totals.month)} icon={Wallet} />
    </div>
  );
}