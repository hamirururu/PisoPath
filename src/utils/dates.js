const pad = (n) => String(n).padStart(2, "0");

// Local (device) calendar date as YYYY-MM-DD
export const localISO = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayISO = () => localISO();

export function startOfWeekISO() {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return localISO(d);
}

export function startOfMonthISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
}

export const startOfYearISO = () => `${new Date().getFullYear()}-01-01`;

export function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return localISO(d);
}

export const ALL_TIME_START = "2000-01-01";

export function daysBetweenInclusive(start, end) {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return Math.round((b - a) / 86400000) + 1;
}