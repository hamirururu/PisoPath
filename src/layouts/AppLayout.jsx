import { Outlet } from "react-router-dom";
import { LogOut, Wallet } from "lucide-react";
import Sidebar from "../components/navigation/Sidebar";
import BottomNav from "../components/navigation/BottomNav";
import { APP_NAME } from "../lib/navigation";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-dvh">
      <Sidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-beige bg-cream/95 px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] backdrop-blur lg:hidden">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-earth text-cream">
              <Wallet size={18} />
            </span>
            <span className="font-semibold">{APP_NAME}</span>
          </div>
          <button
            onClick={() => signOut()}
            aria-label="Sign out"
            className="grid size-9 place-items-center rounded-xl text-earth-dark hover:bg-beige/50"
          >
            <LogOut size={18} />
          </button>
        </header>

        <main className="mx-auto max-w-5xl px-4 pb-32 pt-5 lg:px-8 lg:pb-10 lg:pt-8">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}