import { Link } from "react-router-dom";
import {
  Bus, CalendarDays, Plus, RefreshCw, ShoppingBag, Tag,
  UtensilsCrossed, Wallet,
} from "lucide-react";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import SummaryCard from "../components/dashboard/SummaryCard";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import DailySpendingChart from "../components/dashboard/DailySpendingChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import { useAuth } from "../hooks/useAuth";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatLongDate, formatPeso } from "../utils/format";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";

export default function Dashboard() {
  const { user } = useAuth();
  const { loading, error, summary, categoryBreakdown, dailySpending, recent, reload } =
    useDashboardData();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0];

  return (
    <section className="space-y-6">
<header className="flex flex-wrap items-center justify-between gap-3">
  <div className="flex items-center gap-3">
    <Avatar
      url={user?.user_metadata?.avatar_url}
      name={user?.user_metadata?.full_name || user?.email}
      size={44}
    />
    <div>
      <button onClick={reload} className="flex items-center gap-1.5 text-sm text-earth-dark">
        <CalendarDays size={14} /> {formatLongDate()}
        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
      </button>
      <h1 className="text-2xl font-semibold">
        Welcome{firstName ? `, ${firstName}` : ""} 👋
      </h1>
    </div>
  </div>
  <Link to="/add">
    <Button>
      <Plus size={18} /> Quick Add Expense
    </Button>
  </Link>
</header>

      {error && <Alert variant="error">{error}</Alert>}

{loading ? (
  <div className="flex items-center justify-center py-16">
    <Spinner size={36} />
  </div>
) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryCard label="Today" amount={formatPeso(summary.today)} icon={CalendarDays} emphasis />
            <SummaryCard label="This week" amount={formatPeso(summary.week)} icon={CalendarDays} />
            <SummaryCard label="This month" amount={formatPeso(summary.month)} icon={CalendarDays} />
            <SummaryCard label="Overall" amount={formatPeso(summary.overall)} icon={Wallet} />
          </div>

          <div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <SummaryCard label="Transportation" amount={formatPeso(summary.transportation)} icon={Bus} />
              <SummaryCard label="Food" amount={formatPeso(summary.food)} icon={UtensilsCrossed} />
              <SummaryCard label="Shopping" amount={formatPeso(summary.shopping)} icon={ShoppingBag} />
              <SummaryCard label="Other" amount={formatPeso(summary.other)} icon={Tag} />
            </div>
            <p className="mt-2 text-xs text-earth-dark">
              Category totals reflect this month's spending.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <DailySpendingChart data={dailySpending} />
            <CategoryBreakdown data={categoryBreakdown} />
          </div>

          <RecentTransactions items={recent} />
        </>
      )}
    </section>
  );
}