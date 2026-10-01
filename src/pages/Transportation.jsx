import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Alert from "../components/ui/Alert";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Spinner from "../components/ui/Spinner";
import TransportSummaryCards from "../components/transportation/TransportSummaryCards";
import FavoriteRoutes from "../components/transportation/FavoriteRoutes";
import TransportFilters from "../components/transportation/TransportFilters";
import TransportHistoryList from "../components/transportation/TransportHistoryList";
import { useTransportationData } from "../hooks/useTransportationData";
import { deleteExpense } from "../services/expenseService";

export default function Transportation() {
  const { expenses, favorites, totals, loading, error, reload, removeFavorite, detailOf } =
    useTransportationData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.filter((e) => {
      const detail = detailOf(e);
      if (type && detail?.transportation_type !== type) return false;
      if (q) {
        const haystack = `${detail?.starting_point || ""} ${detail?.destination || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [expenses, search, type, detailOf]);

  function handleUseFavorite(route) {
    navigate("/add", {
      state: {
        expense: {
          category: "Transportation",
          expense_date: new Date().toISOString().slice(0, 10),
          expense_time: new Date().toTimeString().slice(0, 5),
          amount: route.default_fare || "",
          notes: "",
          transportation_details: {
            transportation_type: route.transportation_type,
            starting_point: route.starting_point,
            destination: route.destination,
          },
          id: undefined, // ensures AddExpense/forms treat this as a new entry, not an edit
        },
      },
    });
  }

  function handleEdit(expense) {
    navigate("/add", { state: { expense } });
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteExpense(pendingDelete.id);
      toast.success("Expense deleted.");
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message || "Could not delete this expense.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Transportation</h1>

      {error && <Alert variant="error">{error}</Alert>}

{loading ? (
  <div className="flex justify-center py-16">
    <Spinner size={36} />
  </div>
) : (
        <>
          <TransportSummaryCards totals={totals} />
          <FavoriteRoutes routes={favorites} onUse={handleUseFavorite} onRemove={removeFavorite} />
          <TransportFilters search={search} onSearch={setSearch} type={type} onType={setType} />
          <TransportHistoryList
            items={filtered}
            detailOf={detailOf}
            onEdit={handleEdit}
            onDelete={setPendingDelete}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this expense?"
        message={
          pendingDelete
            ? `This will permanently delete this ₱${Number(pendingDelete.amount).toFixed(2)} transportation expense. This cannot be undone.`
            : ""
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}