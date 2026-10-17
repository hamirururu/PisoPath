import { fetchExpensesBetween } from "../services/expenseService";
import { formatPeso } from "../utils/format";
import { localISO } from "../utils/dates";

// Only non-sensitive flags/dates are stored: no tokens, no amounts.
const k = (uid, name) => `pp:${uid}:notify:${name}`;
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export const notificationsSupported = () =>
  typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator;

export const isEnabled = (uid) =>
  notificationsSupported() &&
  Notification.permission === "granted" &&
  localStorage.getItem(k(uid, "on")) === "1";

const monthKey = (d) => localISO(d).slice(0, 7);
const isLastDayOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() === d.getDate();

// The most recent day that has "ended" (23:59 passed): today from 23:59, otherwise yesterday.
function endedDay(now = new Date()) {
  const t = new Date(now);
  if (!(now.getHours() === 23 && now.getMinutes() >= 59)) t.setDate(t.getDate() - 1);
  return t;
}

// The most recent month that has ended, relative to that ended day.
function endedMonthKey(day) {
  return isLastDayOfMonth(day) ? monthKey(day) : monthKey(new Date(day.getFullYear(), day.getMonth() - 1, 1));
}

async function show(title, body, tag) {
  const opts = { body, tag, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png" };
  const reg = await navigator.serviceWorker.getRegistration();
  if (reg) return reg.showNotification(title, opts); // required on Android
  new Notification(title, opts); // dev fallback (no service worker)
}

async function totalBetween(start, end) {
  const rows = await fetchExpensesBetween(start, end);
  return { total: rows.reduce((s, r) => s + Number(r.amount), 0), count: rows.length };
}

const plural = (n) => `${n} transaction${n === 1 ? "" : "s"}`;

async function notifyDay(dayKey) {
  const { total, count } = await totalBetween(dayKey, dayKey);
  const isToday = dayKey === localISO();
  await show(
    isToday ? "Today's spending" : "Yesterday's spending",
    count === 0
      ? "You didn't record any expenses."
      : `You spent ${formatPeso(total)} across ${plural(count)}.`,
    `day-${dayKey}`
  );
}

async function notifyMonth(mKey) {
  const [y, m] = mKey.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  const { total, count } = await totalBetween(`${mKey}-01`, `${mKey}-${String(last).padStart(2, "0")}`);
  await show(
    `${MONTHS[m - 1]} spending summary`,
    count === 0
      ? "You didn't record any expenses this month."
      : `You spent ${formatPeso(total)} in ${MONTHS[m - 1]} across ${plural(count)}.`,
    `month-${mKey}`
  );
}

// Called when the user turns notifications on: start counting from now, no backlog.
export function setBaseline(uid) {
  const day = endedDay();
  localStorage.setItem(k(uid, "on"), "1");
  localStorage.setItem(k(uid, "day"), localISO(day));
  localStorage.setItem(k(uid, "month"), endedMonthKey(day));
}

export function disable(uid) {
  localStorage.removeItem(k(uid, "on"));
}

export async function sendTest() {
  await show("PisoPath notifications are on", "You'll get a daily summary at 11:59 PM and a monthly one at month end.", "test");
}

let busy = false;
export async function runCheck(uid) {
  if (busy || !isEnabled(uid)) return;
  busy = true;
  try {
    const day = endedDay();
    const dayKey = localISO(day);
    const lastDay = localStorage.getItem(k(uid, "day"));
    if (lastDay && dayKey > lastDay) {
      localStorage.setItem(k(uid, "day"), dayKey); // claim first so it can't double-send
      try { await notifyDay(dayKey); } catch { localStorage.setItem(k(uid, "day"), lastDay); }
    }

    const mKey = endedMonthKey(day);
    const lastMonth = localStorage.getItem(k(uid, "month"));
    if (lastMonth && mKey > lastMonth) {
      localStorage.setItem(k(uid, "month"), mKey);
      try { await notifyMonth(mKey); } catch { localStorage.setItem(k(uid, "month"), lastMonth); }
    }
  } finally {
    busy = false;
  }
}