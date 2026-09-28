const variants = {
  primary: "bg-earth text-cream hover:bg-earth-dark",
  soft: "bg-beige text-ink hover:bg-beige/70",
  sage: "bg-sage text-ink hover:bg-sage/80",
};

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}