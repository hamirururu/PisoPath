import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, TriangleAlert, TrendingUp, Wallet } from "lucide-react";
import { useNotificationsStore } from "../../hooks/useNotifications";
import { KIND, toneClass } from "../../lib/notifications";

const iconFor = {
  [KIND.DAILY_TOTAL]: TrendingUp,
  [KIND.BUDGET_WARNING]: TriangleAlert,
  [KIND.BUDGET_EXCEEDED]: TriangleAlert,
  [KIND.UPDATE]: Wallet,
};

const targetFor = {
  [KIND.DAILY_TOTAL]: "/reports",
  [KIND.BUDGET_WARNING]: "/budgets",
  [KIND.BUDGET_EXCEEDED]: "/budgets",
  [KIND.UPDATE]: "/",
};

function when(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(ts).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

export default function NotificationBell() {
  const { items, unreadCount, markAllRead, markRead, remove, clearAll } = useNotificationsStore();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        className="relative grid size-10 place-items-center rounded-2xl text-earth-dark transition-colors hover:bg-beige/50"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-cream">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Arrow points up at the bell, inset to match the button's centre. */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full z-50 size-3 -translate-x-1/2 -translate-y-1.5 rotate-45 bg-paper ring-1 ring-beige [clip-path:polygon(100%_0,100%_100%,0_100%)]"
          />
          <div className="animate-banner-in absolute left-1/2 z-50 mt-3 w-80 -translate-x-1/2 overflow-hidden rounded-3xl bg-paper shadow-xl ring-1 ring-beige">
            <div className="flex items-center justify-between border-b border-beige px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {items.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-earth-dark underline"
                >
                  Clear all
                </button>
              )}
            </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-earth-dark">
              Nothing yet. Budget alerts and daily totals will show up here.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
            {items.map((n) => {
              const Icon = iconFor[n.kind] ?? Bell;
              return (
                <li key={n.key} className="border-b border-beige/60 last:border-0">
                  <div className="flex items-start gap-3 px-4 py-3">
                    <button
                      onClick={() => {
                        markRead(n.key);
                        setOpen(false);
                        navigate(targetFor[n.kind] ?? "/");
                      }}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    >
                      <span className={`mt-0.5 shrink-0 ${toneClass[n.tone]}`}>
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{n.title}</span>
                        <span className="block text-xs text-earth-dark">{n.body}</span>
                        <span className="mt-0.5 block text-[11px] text-earth-dark/70">
                          {when(n.at)}
                        </span>
                      </span>
                    </button>
                    <button
                      onClick={() => remove(n.key)}
                      aria-label={`Dismiss ${n.title}`}
                      className="shrink-0 rounded-full p-1 text-earth-dark/70 hover:bg-beige/60"
                    >
                      {n.read ? <Trash2 size={13} /> : <Check size={13} />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          )}
          </div>
        </>
      )}
    </div>
  );
}