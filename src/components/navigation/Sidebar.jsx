import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { APP_NAME, desktopNav } from "../../lib/navigation";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import Logo from "../ui/Logo";
import NotificationBell from "../ui/NotificationBell";

export default function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-beige bg-paper p-5 lg:flex">
      <div className="mb-8 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div>
            <p className="font-semibold leading-tight">{APP_NAME}</p>
            <p className="text-xs text-earth-dark">Expense Tracker</p>
          </div>
        </div>
        <NotificationBell />
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
        {desktopNav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-earth text-cream shadow-sm" : "text-earth-dark hover:bg-beige/50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-beige pt-4">
        <div className="mb-2 flex items-center gap-2.5 px-1">
          <Avatar
            url={user?.user_metadata?.avatar_url}
            name={user?.user_metadata?.full_name || user?.email}
            size={32}
          />
          <p className="truncate text-xs text-earth-dark">{user?.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-earth-dark transition-colors hover:bg-beige/50"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}