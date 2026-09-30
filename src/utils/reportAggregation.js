import { daysBetweenInclusive } from "./dates";

function detailOf(expense) {
  return Array.isArray(expense.transportation_details)
    ? expense.transportation_details[0]
    : expense.transportation_details;
}

function toSortedList(totals) {
  return Object.entries(totals)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total);
}

export function buildReport(rows, start, end) {
  const totalSpent = rows.reduce((s, r) => s + Number(r.amount), 0);
  const totalTransactions = rows.length;
  const dayCount = daysBetweenInclusive(start, end);
  const averageDaily = dayCount > 0 ? totalSpent / dayCount : 0;

  const dailyTotals = {};
  const categoryTotals = {};
  const transportationTotals = {};
  const foodTotals = {};

  for (const row of rows) {
    dailyTotals[row.expense_date] = (dailyTotals[row.expense_date] || 0) + Number(row.amount);
    categoryTotals[row.category] = (categoryTotals[row.category] || 0) + Number(row.amount);

    if (row.category === "Transportation") {
      const detail = detailOf(row);
      const key = detail?.transportation_type || "Other";
      transportationTotals[key] = (transportationTotals[key] || 0) + Number(row.amount);
    }
    if (row.category === "Food") {
      const key = row.subcategory || "Other";
      foodTotals[key] = (foodTotals[key] || 0) + Number(row.amount);
    }
  }

  let highestDay = null;
  for (const [date, total] of Object.entries(dailyTotals)) {
    if (!highestDay || total > highestDay.total) highestDay = { date, total };
  }

  // Daily series for short ranges, monthly series for long ones
  const useMonthly = dayCount > 45;
  let series = [];
  if (useMonthly) {
    const monthTotals = {};
    for (const [date, total] of Object.entries(dailyTotals)) {
      const key = date.slice(0, 7); // YYYY-MM
      monthTotals[key] = (monthTotals[key] || 0) + total;
    }
    series = Object.entries(monthTotals)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, total]) => {
        const [y, m] = key.split("-");
        const label = new Date(`${key}-01T00:00:00`).toLocaleDateString("en-PH", {
          month: "short",
          year: y === String(new Date().getFullYear()) ? undefined : "2-digit",
        });
        return { key, label, total };
      });
  } else {
    const cursor = new Date(`${start}T00:00:00`);
    const endDate = new Date(`${end}T00:00:00`);
    while (cursor <= endDate) {
      const iso = cursor.toISOString().slice(0, 10);
      series.push({
        key: iso,
        label: cursor.toLocaleDateString("en-PH", { month: "short", day: "numeric" }),
        total: dailyTotals[iso] || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  return {
    totalSpent,
    totalTransactions,
    averageDaily,
    highestDay,
    categoryBreakdown: toSortedList(categoryTotals),
    transportationBreakdown: toSortedList(transportationTotals),
    foodBreakdown: toSortedList(foodTotals),
    series,
    granularity: useMonthly ? "monthly" : "daily",
  };
}