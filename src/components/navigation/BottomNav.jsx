import { NavLink } from "react-router-dom";
import { mobileNav } from "../../lib/navigation";

export default function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-beige bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid min-h-16 max-w-md grid-cols-5 items-end px-1 sm:px-2">
        {mobileNav.map(({ to, label, icon: Icon, end, primary }) => (
          <li key={to} className="flex justify-center">
            {primary ? (
              <NavLink
                to={to}
                aria-label="Add expense"
                className="-mt-6 flex min-w-0 flex-col items-center pb-2"
              >
                <span className="grid size-14 place-items-center rounded-full bg-earth text-cream shadow-lg ring-4 ring-cream transition-transform active:scale-95">
                  <Icon size={24} />
                </span>
                <span className="mt-1 max-w-full truncate px-1 text-[11px] font-medium text-earth-dark">
                  {label}
                </span>
              </NavLink>
            ) : (
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-16 w-full min-w-0 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                    isActive ? "text-ink" : "text-earth-dark/70"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-7 w-12 place-items-center rounded-full transition-colors ${
                        isActive ? "bg-beige" : ""
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="max-w-full truncate px-1">{label}</span>
                  </>
                )}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}