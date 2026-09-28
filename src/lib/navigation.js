import {
  Bus,
  ChartColumn,
  History,
  House,
  LayoutDashboard,
  PiggyBank,
  Plus,
  Settings,
} from "lucide-react";

export const APP_NAME = "PisoPath";

// Desktop sidebar
export const desktopNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/add", label: "Add Expense", icon: Plus },
  { to: "/history", label: "Expense History", icon: History },
  { to: "/transportation", label: "Transportation", icon: Bus },
  { to: "/reports", label: "Reports", icon: ChartColumn },
  { to: "/budgets", label: "Budgets", icon: PiggyBank },
  { to: "/settings", label: "Settings", icon: Settings },
];

// Mobile bottom bar (center item is the raised "Add" button)
export const mobileNav = [
  { to: "/", label: "Home", icon: House, end: true },
  { to: "/reports", label: "Reports", icon: ChartColumn },
  { to: "/add", label: "Add", icon: Plus, primary: true },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];