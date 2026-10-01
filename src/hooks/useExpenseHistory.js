import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const SELECT_WITH_TRANSPORT = `
  id, category, expense_name, store_name, subcategory, amount,
  expense_date, expense_time, notes, created_at,
  transportation_details ( transportation_type, starting_point, destination )
`;

export function useExpenseHistory() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select(SELECT_WITH_TRANSPORT)
        .order("expense_date", { ascending: false })
        .order("expense_time", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      setExpenses(data);
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

  // Group into { "2026-09-30": [...], "2026-09-29": [...] }, already sorted
  const grouped = expenses.reduce((acc, e) => {
    (acc[e.expense_date] ||= []).push(e);
    return acc;
  }, {});

  return { expenses, grouped, loading, error, reload };
}