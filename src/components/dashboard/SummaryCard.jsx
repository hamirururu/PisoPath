export default function SummaryCard({ label, amount, icon: Icon, emphasis = false }) {
  return (
    <div
      className={`rounded-3xl p-4 shadow-sm ring-1 ${
        emphasis ? "bg-earth text-cream ring-earth" : "bg-paper text-ink ring-beige/70"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className={`text-xs font-medium ${emphasis ? "text-cream/80" : "text-earth-dark"}`}>
          {label}
        </span>
        <Icon size={16} className={emphasis ? "text-cream/80" : "text-earth-dark"} />
      </div>
      <p className="text-lg font-semibold">{amount}</p>
    </div>
  );
}