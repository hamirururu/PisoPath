import { useCallback, useEffect, useState } from "react";
import { fetchAllExpensesFull } from "../services/expenseService";

export function useExpenseHistory() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllExpensesFull();
      setExpenses(data);
    } catch (err) {
      setError(
        !navigator.onLine
          ? "You're offline. Connect to the internet to load your data."
          : err.message || "Could not load expenses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Group into { "2026-09-30": [...], "2026-09-29": [...] }, already sorted
  const grouped = expenses.reduce((acc, e) => {
    (acc[e.expense_date] ||= []).push(e);
    return acc;
  }, {});

  return { expenses, grouped, loading, error, reload };
}