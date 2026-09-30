// Recharts right-aligns Y ticks inside a fixed-width gutter, which left the
// labels indented vs the card title. Anchor them at x=0 so they sit flush with
// the heading, and keep the gutter narrow so the gridlines start close by.
export default function YTick({ y, payload }) {
  return (
    <text x={0} y={y} dominantBaseline="middle" fontSize={12} fill="#6B5A3B">
      ₱{payload.value}
    </text>
  );
}