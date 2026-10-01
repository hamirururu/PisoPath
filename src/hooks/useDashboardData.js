import { useCallback, useEffect, useState } from "react";
import {
  fetchAllAmounts,
  fetchExpensesBetween,
  fetchRecentExpenses,
} from "../services/expenseService";
import { startOfMonthISO, startOfWeekISO, toLocalISO, todayISO } from "../utils/dates";

const BUCKET_KEYS = ["Transportation", "Food", "Shopping"];

function emptySummary() {
  return {
    today: 0, week: 0, month: 0, overall: 0,
    transportation: 0, food: 0, shopping: 0, other: 0,
  };
}

export function useDashboardData() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    summary: emptySummary(),
    categoryBreakdown: [],
    dailySpending: [],
    recent: [],
  });

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const today = todayISO();
      const weekStart = startOfWeekISO(); // Monday of this week
      const monthStart = startOfMonthISO();

      // Monday-of-this-week through Sunday-of-this-week
      const weekStartDate = new Date(`${weekStart}T00:00:00`);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      const weekEnd = toLocalISO(weekEndDate);

      const [allAmounts, chartRows, recent] = await Promise.all([
        fetchAllAmounts(),
        fetchExpensesBetween(weekStart, weekEnd),
        fetchRecentExpenses(6),
      ]);

      const summary = emptySummary();
      summary.overall = allAmounts.reduce((sum, r) => sum + Number(r.amount), 0);

      const monthRows = allAmounts.filter((r) => r.expense_date >= monthStart);
      summary.month = monthRows.reduce((s, r) => s + Number(r.amount), 0);
      summary.week = allAmounts
        .filter((r) => r.expense_date >= weekStart && r.expense_date <= weekEnd)
        .reduce((s, r) => s + Number(r.amount), 0);
      summary.today = allAmounts
        .filter((r) => r.expense_date === today)
        .reduce((s, r) => s + Number(r.amount), 0);

      const categoryTotals = {};
      for (const row of monthRows) {
        categoryTotals[row.category] = (categoryTotals[row.category] || 0) + Number(row.amount);
      }
      summary.transportation = categoryTotals["Transportation"] || 0;
      summary.food = categoryTotals["Food"] || 0;
      summary.shopping = categoryTotals["Shopping"] || 0;
      summary.other = Object.entries(categoryTotals)
        .filter(([cat]) => !BUCKET_KEYS.includes(cat))
        .reduce((s, [, v]) => s + v, 0);

      const categoryBreakdown = Object.entries(categoryTotals)
        .map(([category, total]) => ({ category, total }))
        .sort((a, b) => b.total - a.total);

      // Build Mon..Sun in fixed order, regardless of what today is
      const dayMap = {};
      for (const row of chartRows) {
        dayMap[row.expense_date] = (dayMap[row.expense_date] || 0) + Number(row.amount);
      }
      const dailySpending = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(weekStartDate);
        d.setDate(weekStartDate.getDate() + i);
        const iso = toLocalISO(d);
        dailySpending.push({
          date: iso,
          label: d.toLocaleDateString("en-PH", { weekday: "short" }),
          total: dayMap[iso] || 0,
        });
      }

      setState({ loading: false, error: "", summary, categoryBreakdown, dailySpending, recent });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: !navigator.onLine
  ? "You're offline. Connect to the internet to load your expenses."
  : err.message || "Could not load dashboard data.",
      }));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}