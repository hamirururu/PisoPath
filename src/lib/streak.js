import { localISO } from "../utils/dates";

const prevDay = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return localISO(new Date(y, m - 1, d - 1));
};

export function computeStreak(dateList, today = localISO()) {
  const days = new Set(dateList.filter((d) => d <= today)); // ignore future-dated entries
  const loggedToday = days.has(today);

  // Current streak: ends today, or yesterday if today isn't logged yet
  let current = 0;
  let cursor = loggedToday ? today : prevDay(today);
  while (days.has(cursor)) {
    current += 1;
    cursor = prevDay(cursor);
  }

  // Longest streak ever
  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  sorted.forEach((d, i) => {
    run = i > 0 && prevDay(d) === sorted[i - 1] ? run + 1 : 1;
    longest = Math.max(longest, run);
  });

  return { current, longest, totalDays: days.size, loggedToday };
}