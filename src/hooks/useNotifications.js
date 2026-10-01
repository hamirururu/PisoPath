import { useCallback, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { buildNotifications, prune } from "../lib/notifications";
import { NotificationsContext } from "../contexts/notifications-context";

const STORAGE_KEY = "pisopath-notifications";

// Most urgent first, so the toast surfaces a blown budget over a daily summary.
const priority = (n) =>
  ({ "budget-exceeded": 3, "budget-warning": 2, "daily-total": 1, update: 0 })[n.kind] ?? 0;

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? prune(JSON.parse(raw)) : [];
  } catch {
    // Corrupt or unavailable storage must never break the app.
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* private mode or quota exceeded — in-memory state still works */
  }
}

export function useNotifications() {
  const [items, setItems] = useState(read);

  useEffect(() => {
    write(items);
  }, [items]);

  // Merge newly derived notifications, skipping keys already seen so the same
  // fact doesn't re-toast on every render.
  const ingest = useCallback((candidates) => {
    setItems((prev) => {
      const seen = new Set(prev.map((n) => n.key));
      const fresh = candidates.filter((n) => !seen.has(n.key));
      if (fresh.length === 0) return prev;
      const now = Date.now();
      const stamped = fresh.map((n) => ({ ...n, at: now, read: false }));

      // Toast only the most urgent new item; the bell keeps the rest.
      const top = [...stamped].sort(
        (a, b) => priority(b) - priority(a) || b.at - a.at
      )[0];
      if (top) {
        if (top.kind === "budget-exceeded") toast.error(top.title);
        else if (top.kind === "budget-warning") toast(top.title, { icon: "⚠️" });
      }

      return prune([...stamped, ...prev]);
    });
  }, []);

  const markAllRead = useCallback(() => {
    setItems((prev) => (prev.every((n) => n.read) ? prev : prev.map((n) => ({ ...n, read: true }))));
  }, []);

  const markRead = useCallback((key) => {
    setItems((prev) => prev.map((n) => (n.key === key ? { ...n, read: true } : n)));
  }, []);

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((n) => n.key !== key));
  }, []);

  const clearAll = useCallback(() => setItems([]), []);

  return {
    items,
    unreadCount: items.filter((n) => !n.read).length,
    ingest,
    markAllRead,
    markRead,
    remove,
    clearAll,
  };
}

// Reads the shared list. Must be called inside <NotificationsProvider>.
export function useNotificationsStore() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsStore must be used inside <NotificationsProvider>");
  return ctx;
}

// Turns budget + daily-spend facts into notifications as data arrives.
export function useNotificationWatcher({ today, monthKey, todayTotal, budgets, categoryTotals }) {
  const { ingest } = useNotificationsStore();
  useEffect(() => {
    const hasBudgets = budgets && budgets.length > 0;
    if (todayTotal == null && !hasBudgets) return;
    ingest(buildNotifications({ today, monthKey, todayTotal, budgets, categoryTotals }));
  }, [today, monthKey, todayTotal, budgets, categoryTotals, ingest]);
}

export { buildNotifications };