import { formatPeso } from "../utils/format";

// Notifications are derived from the user's own data, then stored locally so a
// condition that already fired doesn't re-notify on every render. `key` is the
// dedupe identity: same key means "already told them", so keys carry the day or
// month the fact belongs to.

export const WARNING_PCT = 80;
export const MAX_STORED = 50;
export const PRUNE_DAYS = 30;

export const KIND = {
  UPDATE: "update",
  DAILY_TOTAL: "daily-total",
  BUDGET_WARNING: "budget-warning",
  BUDGET_EXCEEDED: "budget-exceeded",
};

export const toneClass = {
  info: "text-earth-dark",
  warning: "text-[#8a6d1f]",
  danger: "text-danger",
};

function budgetMessage({ label, spent, amount }) {
  if (spent > amount) {
    return {
      tone: "danger",
      body: `${formatPeso(spent)} of ${formatPeso(amount)} used — ${formatPeso(spent - amount)} over this month.`,
    };
  }
  return {
    tone: "warning",
    body: `${formatPeso(spent)} of ${formatPeso(amount)} used — ${formatPeso(amount - spent)} left this month.`,
  };
}

export function buildNotifications({
  today,
  monthKey,
  todayTotal,
  budgets = [],
  categoryTotals = {},
}) {
  const out = [];

  if (todayTotal > 0) {
    out.push({
      key: `daily-total:${today}`,
      kind: KIND.DAILY_TOTAL,
      tone: "info",
      title: "Today's spending",
      body: `You have spent ${formatPeso(todayTotal)} today.`,
    });
  }

  for (const row of budgets) {
    const amount = Number(row.amount);
    if (!Number.isFinite(amount) || amount <= 0) continue;

    const label = row.category ?? "Total monthly budget";
    const spent = Number(
      row.category == null
        ? Object.values(categoryTotals).reduce((s, v) => s + Number(v), 0)
        : categoryTotals[row.category] || 0
    );
    const pct = Math.round((spent / amount) * 100);

    if (spent > amount) {
      const { tone, body } = budgetMessage({ label, spent, amount });
      out.push({
        key: `budget-over:${monthKey}:${row.category ?? "total"}`,
        kind: KIND.BUDGET_EXCEEDED,
        tone,
        title: `Over budget: ${label}`,
        body,
      });
    } else if (pct >= WARNING_PCT) {
      const { tone, body } = budgetMessage({ label, spent, amount });
      out.push({
        key: `budget-warn:${monthKey}:${row.category ?? "total"}`,
        kind: KIND.BUDGET_WARNING,
        tone,
        title: `${label} is ${pct}% used`,
        body,
      });
    }
  }

  return out;
}

export function prune(items) {
  const cutoff = Date.now() - PRUNE_DAYS * 86400000;
  return items
    .filter((n) => !n.at || n.at >= cutoff)
    .sort((a, b) => b.at - a.at)
    .slice(0, MAX_STORED);
}