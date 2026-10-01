import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, TriangleAlert, TrendingUp, Wallet, X } from "lucide-react";
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

// Positioning lives here and never animates: left-50% + translateX(-50%) holds
// the panel centred no matter what the inner element is doing. Keeping the
// centring transform off the animated element avoids a conflict — Tailwind v4's
// -translate-x-1/2 sets the separate CSS `translate` property, which composes
// with `transform` rather than being replaced by it, so animating `transform`
// on the same element shifts it horizontally.
const WRAP_CLASS =
  "pointer-events-none fixed left-1/2 z-40 w-[calc(100vw-2rem)] max-w-sm " +
  "-translate-x-1/2 top-[calc(env(safe-area-inset-top)+4.25rem)]";

// Only opacity / translateY / scale are animated here.
const ANIM_CLASS = {
  in: "animate-notif-in",
  out: "animate-notif-out",
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
  // Kept mounted through the exit animation, then unmounted.
  const [rendered, setRendered] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);
  const navigate = useNavigate();

  const show = () => {
    setOpen(true);
    setRendered(true);
    setClosing(false);
  };

  const hide = () => {
    setOpen(false);
    setClosing(true);
  };

  useEffect(() => {
    if (!rendered || !closing) return;
    // Must match the notif-out duration in index.css, or the panel unmounts
    // mid-animation and the fade is cut short.
    const t = setTimeout(() => {
      setRendered(false);
      setClosing(false);
    }, 220);
    return () => clearTimeout(t);
  }, [rendered, closing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && hide();
    const onClick = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) hide();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => {
          if (open) hide();
          else {
            show();
            markAllRead();
          }
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

      {/* Portal to body: the header uses backdrop-blur, which makes it a
          containing block for fixed positioning. Without this the panel would
          anchor to the header instead of the viewport. */}
      {rendered &&
        createPortal(
          <div className={WRAP_CLASS}>
            <div
              ref={dialogRef}
              role="dialog"
              aria-label="Notifications"
              className={`pointer-events-auto overflow-hidden rounded-3xl bg-paper shadow-xl ring-1 ring-beige ${
                closing ? ANIM_CLASS.out : ANIM_CLASS.in
              }`}
            >
            <div className="flex items-center justify-between border-b border-beige px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs font-medium text-earth-dark underline"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={hide}
                  aria-label="Close notifications"
                  className="grid size-8 place-items-center rounded-full text-earth-dark hover:bg-beige/50"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-earth-dark">
                Nothing yet. Budget alerts and daily totals will show up here.
              </p>
            ) : (
              <ul className="max-h-[60vh] overflow-y-auto">
                {items.map((n) => {
                  const Icon = iconFor[n.kind] ?? Bell;
                  return (
                    <li key={n.key} className="border-b border-beige/60 last:border-0">
                      <div className="flex items-start gap-3 px-4 py-3">
                        <button
                          onClick={() => {
                            markRead(n.key);
                            hide();
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
          </div>,
          document.body
        )}
    </>
  );
}