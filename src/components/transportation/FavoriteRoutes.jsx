import { useState } from "react";
import toast from "react-hot-toast";
import { Star, Trash2, X } from "lucide-react";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";
import { getTransportIcon } from "../../lib/categoryIcons";
import { formatPeso } from "../../utils/format";

export default function FavoriteRoutes({ routes, onUse, onRemove }) {
  const [removingId, setRemovingId] = useState(null);

  async function handleRemove(id) {
    setRemovingId(id);
    try {
      await onRemove(id);
      toast.success("Favorite route removed.");
    } catch (err) {
      toast.error(err.message || "Could not remove this route.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <Card>
      <h2 className="mb-4 flex items-center gap-2 font-semibold">
        <Star size={16} className="text-earth-dark" /> Favorite routes
      </h2>
      {routes.length === 0 ? (
        <EmptyState icon={Star} text="No favorite routes yet. Save one from the Add Expense form." />
      ) : (
        <ul className="grid gap-2 sm:grid-cols-2">
          {routes.map((r) => {
            const Icon = getTransportIcon(r.transportation_type);
            return (
              <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-cream p-3 ring-1 ring-beige/60">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-beige/60 text-earth-dark">
                  <Icon size={16} />
                </span>
                <button onClick={() => onUse(r)} className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-medium">
                    {r.starting_point} → {r.destination}
                  </p>
                  <p className="text-xs text-earth-dark">
                    {r.transportation_type}
                    {r.default_fare ? ` · ${formatPeso(r.default_fare)}` : ""}
                  </p>
                </button>
                <button
                  onClick={() => handleRemove(r.id)}
                  disabled={removingId === r.id}
                  aria-label="Remove favorite"
                  className="grid size-7 shrink-0 place-items-center rounded-full text-earth-dark hover:bg-beige/60"
                >
                  {removingId === r.id ? <X size={14} /> : <Trash2 size={14} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}