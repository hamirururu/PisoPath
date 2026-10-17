import { useEffect, useState } from "react";
import { fetchAllAmounts } from "../services/expenseService";
import { computeStreak } from "../lib/streak";

export function usePetStreak() {
  const [state, setState] = useState({ loading: true, error: false, streak: null });

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchAllAmounts()
        .then((rows) => {
          if (alive) setState({ loading: false, error: false, streak: computeStreak(rows.map((r) => r.expense_date)) });
        })
        .catch(() => alive && setState((s) => ({ ...s, loading: false, error: true })));

    load();
    // Re-check when the app comes back to the foreground (e.g. a new day started)
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return state;
}