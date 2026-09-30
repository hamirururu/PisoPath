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

export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit" }).format(date);
}

// format: "long" (September 28, 2026), "mdy" (09/28/2026), "dmy" (28/09/2026)
export function formatDateByPreference(dateStr, format = "long") {
  const date = new Date(`${dateStr}T00:00:00`);
  if (format === "mdy")
    return new Intl.DateTimeFormat("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).format(date);
  if (format === "dmy")
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  return new Intl.DateTimeFormat("en-PH", { dateStyle: "long" }).format(date);
}