import { Outlet, Link } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import BottomNav from "../components/navigation/BottomNav";
import Avatar from "../components/ui/Avatar";
import Logo from "../components/ui/Logo";
import OfflineBanner from "../components/ui/OfflineBanner";
import NotificationBell from "../components/ui/NotificationBell";
import { APP_NAME } from "../lib/navigation";
import { useAuth } from "../hooks/useAuth";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function AppLayout() {
  const { user } = useAuth();
  // Navigating from a notification lands on a new page at the old scroll offset,
  // which puts the sticky header off-screen.
  useScrollToTop();

  return (
    <div className="min-h-dvh">
      <OfflineBanner />
      <Sidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-beige bg-cream/95 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <Logo size={36} />
            <span className="font-semibold">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Link to="/settings" aria-label="Profile and settings">
              <Avatar
                url={user?.user_metadata?.avatar_url}
                name={user?.user_metadata?.full_name || user?.email}
                size={32}
              />
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-32 pt-5 lg:px-8 lg:pb-10 lg:pt-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}