// A small cycling palette derived from the four brand colors, for charts
// that need to distinguish more than four categories.
export const chartPalette = [
  "#8A7650", // earth
  "#8E977D", // sage
  "#B99A6B", // earth, lighter
  "#6B7A5E", // sage, darker
  "#C9B589", // beige, darker
  "#A6AE95", // sage, lighter
  "#705937", // earth, darker
  "#D8CBA0", // beige
];

export function colorForIndex(i) {
  return chartPalette[i % chartPalette.length];
}