export default function EmptyState({ icon: Icon, text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-beige/50 text-earth-dark">
        <Icon size={22} />
      </span>
      <p className="text-sm text-earth-dark">{text}</p>
      {action}
    </div>
  );
}