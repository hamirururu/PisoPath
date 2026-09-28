import { Outlet } from "react-router-dom";
import { Wallet } from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";
import BottomNav from "../components/navigation/BottomNav";
import { APP_NAME } from "../lib/navigation";

export default function AppLayout() {
  return (
    <div className="min-h-dvh overflow-x-hidden">
      <Sidebar />

      <div className="min-w-0 lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-beige bg-cream/95 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur lg:hidden">
          <span className="grid size-9 place-items-center rounded-xl bg-earth text-cream">
            <Wallet size={18} />
          </span>
          <span className="truncate font-semibold">{APP_NAME}</span>
        </header>

        <main className="mx-auto min-w-0 max-w-5xl px-4 pb-32 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}