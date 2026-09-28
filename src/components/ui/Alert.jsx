import { CircleAlert, CircleCheck, Info } from "lucide-react";

const styles = {
  error: { cls: "bg-danger-soft text-danger", Icon: CircleAlert },
  success: { cls: "bg-sage/25 text-ink", Icon: CircleCheck },
  info: { cls: "bg-beige/60 text-ink", Icon: Info },
};

export default function Alert({ variant = "info", children }) {
  const { cls, Icon } = styles[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${cls}`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}