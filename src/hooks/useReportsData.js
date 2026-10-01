import { useCallback, useEffect, useState } from "react";
import { fetchExpensesBetween } from "../services/expenseService";
import { buildReport } from "../utils/reportAggregation";

export function useReportsData(range) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await fetchExpensesBetween(range.start, range.end);
      setReport(buildReport(rows, range.start, range.end));
    } catch (err) {
      setError(
  !navigator.onLine
    ? "You're offline. Connect to the internet to load your data."
    : err.message || "Could not load ... ."
);
    } finally {
      setLoading(false);
    }
  }, [range.start, range.end]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { report, loading, error, reload };
}