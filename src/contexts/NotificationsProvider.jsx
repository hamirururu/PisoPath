import { NotificationsContext } from "./notifications-context";
import { useNotifications } from "../hooks/useNotifications";

// Single source of truth for the list. Mounted once in main.jsx so the bell,
// the toast, and the budget watcher all share one copy.
export default function NotificationsProvider({ children }) {
  const value = useNotifications();
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}