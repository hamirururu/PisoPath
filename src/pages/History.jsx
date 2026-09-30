import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { History as HistoryIcon, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import Alert from "../components/ui/Alert";
import EmptyState from "../components/ui/EmptyState";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import ExpenseGroup from "../components/history/ExpenseGroup";
import { useExpenseHistory } from "../hooks/useExpenseHistory";
import { deleteExpense } from "../services/expenseService";
import { formatDateByPreference } from "../utils/format";
import { useAuth } from "../hooks/useAuth";

function formatGroupLabel(dateStr, dateFormat) {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  if (sameDay(date, today)) return "Today";
  if (sameDay(date, yesterday)) return "Yesterday";
  return formatDateByPreference(dateStr, dateFormat);
}

export default function History() {
  const { user } = useAuth();
  const dateFormat = user?.user_metadata?.date_format || "long";
  const { grouped, loading, error, reload } = useExpenseHistory();
  const navigate = useNavigate();
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const dates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

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
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">Expense History</h1>

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <div className="flex justify-center py-16 text-earth-dark">
          <LoaderCircle className="animate-spin" size={28} />
        </div>
      ) : dates.length === 0 ? (
        <EmptyState icon={HistoryIcon} text="No expenses recorded yet. Add your first one to see it here." />
      ) : (
        <div className="space-y-6">
          {dates.map((date) => {
            const items = grouped[date];
            const dayTotal = items.reduce((s, e) => s + Number(e.amount), 0);
            return (
              <ExpenseGroup
                key={date}
                dateLabel={formatGroupLabel(date, dateFormat)}
                items={items}
                dayTotal={dayTotal}
                onEdit={handleEdit}
                onDelete={setPendingDelete}
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this expense?"
        message={
          pendingDelete
            ? `This will permanently delete "${pendingDelete.expense_name}" (₱${Number(pendingDelete.amount).toFixed(2)}). This cannot be undone.`
            : ""
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}