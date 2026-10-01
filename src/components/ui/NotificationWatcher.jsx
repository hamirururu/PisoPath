import { useEffect, useMemo, useState } from "react";
import { useNotificationWatcher } from "../../hooks/useNotifications";
import { useAuth } from "../../hooks/useAuth";
import { fetchAllAmounts } from "../../services/expenseService";
import { fetchBudgets } from "../../services/budgetService";
import { startOfMonthISO, todayISO } from "../../utils/dates";

// Mounted once, app-wide. Watches budget + daily-spend facts and raises a
// notification (and a toast) the first time each one becomes true.
export default function NotificationWatcher() {
  const { user, loading } = useAuth();
  const [state, setState] = useState({ todayTotal: null, budgets: [], categoryTotals: {} });

  const today = todayISO();
  const monthStart = startOfMonthISO();
  const monthKey = monthStart.slice(0, 7);

  // Rows are scoped to the signed-in user by RLS, so there is nothing to fetch
  // before the session resolves.
  useEffect(() => {
    if (loading || !user) return;

    let cancelled = false;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    (async () => {
      try {
        const [amounts, budgets] = await Promise.all([
          fetchAllAmounts(),
          fetchBudgets(month, year),
        ]);
        if (cancelled) return;

        const categoryTotals = {};
        let todayTotal = 0;
        for (const row of amounts) {
          if (row.expense_date >= monthStart) {
            categoryTotals[row.category] = (categoryTotals[row.category] || 0) + Number(row.amount);
          }
          if (row.expense_date === today) todayTotal += Number(row.amount);
        }
        setState({ todayTotal, budgets, categoryTotals });
      } catch {
        // Offline or not signed in — the banner already covers the offline case.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [today, monthStart, loading, user]);

  const { todayTotal, budgets } = state;

  // Stable reference, otherwise this effect re-runs on every watcher render.
  const categoryTotals = useMemo(
    () => state.categoryTotals,
    [state.categoryTotals]
  );

  useNotificationWatcher({ today, monthKey, todayTotal, budgets, categoryTotals });

  return null;
}