import { useCallback, useEffect, useState } from "react";
import {
  fetchAllAmounts,
  fetchExpensesBetween,
  fetchRecentExpenses,
} from "../services/expenseService";
import { daysAgoISO, startOfMonthISO, startOfWeekISO, todayISO } from "../utils/dates";

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
      const weekStart = startOfWeekISO();
      const monthStart = startOfMonthISO();
      const chartStart = daysAgoISO(6); // last 7 days, inclusive of today

      const [allAmounts, chartRows, recent] = await Promise.all([
        fetchAllAmounts(),
        fetchExpensesBetween(chartStart, today),
        fetchRecentExpenses(6),
      ]);

      const summary = emptySummary();
      summary.overall = allAmounts.reduce((sum, r) => sum + Number(r.amount), 0);

      const monthRows = allAmounts.filter((r) => r.expense_date >= monthStart);
      summary.month = monthRows.reduce((s, r) => s + Number(r.amount), 0);
      summary.week = allAmounts
        .filter((r) => r.expense_date >= weekStart)
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

      const dayMap = {};
      for (const row of chartRows) {
        dayMap[row.expense_date] = (dayMap[row.expense_date] || 0) + Number(row.amount);
      }
      const dailySpending = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().slice(0, 10);
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
        error: err.message || "Could not load dashboard data.",
      }));
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { ...state, reload };
}