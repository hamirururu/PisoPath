export const formatPeso = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(amount) || 0);

export const formatLongDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-PH", { dateStyle: "long" }).format(date);

export function formatShortDate(dateStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric" }).format(date);
}

// expense_time comes back from Postgres as "HH:MM:SS"
export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit" }).format(date);
}