import { ALL_TIME_START, startOfMonthISO, startOfWeekISO, startOfYearISO, todayISO } from "../utils/dates";

export function buildPresetRanges() {
  const today = todayISO();
  return [
    { key: "week", label: "This week", start: startOfWeekISO(), end: today },
    { key: "month", label: "This month", start: startOfMonthISO(), end: today },
    { key: "year", label: "This year", start: startOfYearISO(), end: today },
    { key: "all", label: "All time", start: ALL_TIME_START, end: today },
  ];
}