import { NavLink } from "react-router-dom";
import { Wallet } from "lucide-react";
import { APP_NAME, desktopNav } from "../../lib/navigation";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col overflow-y-auto border-r border-beige bg-paper p-5 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="grid size-10 place-items-center rounded-2xl bg-earth text-cream">
          <Wallet size={20} />
        </span>
        <div>
          <p className="font-semibold leading-tight">{APP_NAME}</p>
          <p className="text-xs text-earth-dark">Expense Tracker</p>
        </div>
      </div>

      <nav aria-label="Main" className="flex flex-col gap-1">
        {desktopNav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-earth text-cream shadow-sm"
                  : "text-earth-dark hover:bg-beige/50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}