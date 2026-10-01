import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchTransportationExpenses } from "../services/expenseService";
import { fetchFavoriteRoutes, fetchFrequentRoutes, deleteFavoriteRoute } from "../services/routeService";
import { startOfMonthISO, startOfWeekISO, todayISO } from "../utils/dates";

function detailOf(expense) {
  return Array.isArray(expense.transportation_details)
    ? expense.transportation_details[0]
    : expense.transportation_details;
}

export function useTransportationData() {
  const [expenses, setExpenses] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [frequent, setFrequent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [exp, fav, freq] = await Promise.all([
        fetchTransportationExpenses(),
        fetchFavoriteRoutes(),
        fetchFrequentRoutes(6),
      ]);
      setExpenses(exp);
      setFavorites(fav);
      setFrequent(freq);
    } catch (err) {
      setError(
  !navigator.onLine
    ? "You're offline. Connect to the internet to load your data."
    : err.message || "Could not load ... ."
);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const totals = useMemo(() => {
    const today = todayISO();
    const weekStart = startOfWeekISO();
    const monthStart = startOfMonthISO();
    const sum = (rows) => rows.reduce((s, r) => s + Number(r.amount), 0);
    return {
      today: sum(expenses.filter((e) => e.expense_date === today)),
      week: sum(expenses.filter((e) => e.expense_date >= weekStart)),
      month: sum(expenses.filter((e) => e.expense_date >= monthStart)),
    };
  }, [expenses]);

  async function removeFavorite(id) {
    await deleteFavoriteRoute(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }

  return { expenses, favorites, frequent, totals, loading, error, reload, removeFavorite, detailOf };
}