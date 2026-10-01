export default function Spinner({ size = 32, className = "" }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full border-4 border-beige"
        style={{ borderTopColor: "#8A7650" }}
      />
      {/* Spinning layer */}
      <div
        className="absolute inset-0 animate-spin rounded-full border-4 border-transparent"
        style={{ borderTopColor: "#8A7650", animationDuration: "0.8s" }}
      />
      {/* Center dot pulse */}
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="animate-pulse rounded-full bg-sage"
          style={{ width: size * 0.25, height: size * 0.25 }}
        />
      </div>
    </div>
  );
}