import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Database, LogOut, Plus } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { formatLongDate } from "../utils/format";

function DbCheck() {
  const [status, setStatus] = useState({ state: "loading" });

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("expenses")
      .select("id", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (cancelled) return;
        setStatus(
          error
            ? { state: "error", message: error.message }
            : { state: "ok", count }
        );
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="flex items-center gap-4">
      <span className="grid size-12 place-items-center rounded-2xl bg-sage/30 text-earth-dark">
        <Database size={22} />
      </span>
      <div className="text-sm">
        <p className="font-semibold">Database check</p>
        {status.state === "loading" && <p className="text-earth-dark">Connecting…</p>}
        {status.state === "ok" && (
          <p className="text-earth-dark">
            Connected. You have <strong>{status.count}</strong> expenses.
          </p>
        )}
        {status.state === "error" && (
          <Alert variant="error">{status.message}</Alert>
        )}
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(" ")[0];

  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm text-earth-dark">{formatLongDate()}</p>
        <h1 className="text-2xl font-semibold">
          Welcome{firstName ? `, ${firstName}` : ""} 👋
        </h1>
        <p className="text-sm text-earth-dark">{user?.email}</p>
      </header>

      <DbCheck />

      <div className="flex flex-wrap gap-3">
        <Link to="/add">
          <Button>
            <Plus size={18} /> Quick Add Expense
          </Button>
        </Link>
        <Button variant="soft" onClick={() => signOut()}>
          <LogOut size={18} /> Sign out
        </Button>
      </div>
    </section>
  );
}