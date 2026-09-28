export default function Card({ className = "", children }) {
  return (
    <div
      className={`min-w-0 rounded-3xl bg-paper p-4 shadow-sm ring-1 ring-beige/70 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}