import { User } from "lucide-react";

export default function Avatar({ url, name, size = 40, className = "" }) {
  const initial = name?.trim()?.[0]?.toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt="Profile"
        width={size}
        height={size}
        className={`rounded-full object-cover ring-1 ring-beige ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`grid place-items-center rounded-full bg-earth text-cream ${className}`}
      style={{ width: size, height: size }}
    >
      {initial ? (
        <span className="font-semibold" style={{ fontSize: size * 0.4 }}>{initial}</span>
      ) : (
        <User size={size * 0.55} />
      )}
    </span>
  );
}