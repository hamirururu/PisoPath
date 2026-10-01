import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchBudgets } from "../services/budgetService";
import { fetchExpensesBetween } from "../services/expenseService";

function monthBounds(month, year) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

export function useBudgetsData(month, year) {
  const [budgets, setBudgets] = useState([]);
  const [spentByCategory, setSpentByCategory] = useState({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { start, end } = monthBounds(month, year);
      const [budgetRows, expenseRows] = await Promise.all([
        fetchBudgets(month, year),
        fetchExpensesBetween(start, end),
      ]);
      setBudgets(budgetRows);

      const byCategory = {};
      let total = 0;
      for (const row of expenseRows) {
        byCategory[row.category] = (byCategory[row.category] || 0) + Number(row.amount);
        total += Number(row.amount);
      }
      setSpentByCategory(byCategory);
      setTotalSpent(total);
    } catch (err) {
      setError(err.message || "Could not load budgets.");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    reload();
  }, [reload]);

  const totalBudgetRow = useMemo(() => budgets.find((b) => b.category === null) ?? null, [budgets]);
  const totalBudget = totalBudgetRow?.amount ?? null;
  const categoryBudgets = useMemo(
    () => budgets.filter((b) => b.category !== null),
    [budgets]
  );

    return {
    budgets, totalBudget, totalBudgetRow, categoryBudgets, spentByCategory, totalSpent,
    loading, error, reload,
    };
}