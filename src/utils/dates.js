// Always format a calendar day from the local fields. Date.prototype.toISOString()
// converts to UTC first, so local midnight in the Philippines (UTC+8) comes back
// as the *previous* day — which silently shifts every date bucket.
export function toLocalISO(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO() {
  return toLocalISO(new Date());
}

export function startOfWeekISO() {
  const d = new Date();
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return toLocalISO(d);
}

export function startOfMonthISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

export function startOfYearISO() {
  return `${new Date().getFullYear()}-01-01`;
}

export function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toLocalISO(d);
}

export const ALL_TIME_START = "2000-01-01";

export function daysBetweenInclusive(start, end) {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return Math.round((b - a) / 86400000) + 1;
}