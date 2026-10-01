import { useState } from "react";
import toast from "react-hot-toast";
import { LoaderCircle, Plus, Wallet } from "lucide-react";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import BudgetProgress from "../components/budgets/BudgetProgress";
import BudgetFormDialog from "../components/budgets/BudgetFormDialog";
import { useBudgetsData } from "../hooks/useBudgetsData";
import { useCategories } from "../hooks/useCategories";
import { upsertBudget, deleteBudget } from "../services/budgetService";
import { getCategoryIcon } from "../lib/categoryIcons";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Budgets() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const {
    budgets, totalBudget, totalBudgetRow, categoryBudgets, spentByCategory, totalSpent, loading, error, reload
  } = useBudgetsData(month, year);
  const { allCategories } = useCategories();

  const [editing, setEditing] = useState(null); // { category: null|string, label, amount }
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [addingCategory, setAddingCategory] = useState(""); // category selected in the "add new" dropdown

  const budgetedCategoryNames = categoryBudgets.map((b) => b.category);
  const unbudgetedCategories = allCategories.filter((c) => !budgetedCategoryNames.includes(c));

  async function handleSaveBudget(amount) {
    try {
      await upsertBudget({ category: editing.category, amount, month, year });
      toast.success("Budget saved.");
      setEditing(null);
      setAddingCategory("");
      reload();
    } catch (err) {
      toast.error(err.message || "Could not save this budget.");
    }
  }

  async function confirmDeleteBudget() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteBudget(pendingDelete.id);
      toast.success("Budget removed.");
      setPendingDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message || "Could not remove this budget.");
    } finally {
      setDeleting(false);
    }
  }

  function findBudgetId(category) {
    return categoryBudgets.find((b) => b.category === category)?.id;
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <div className="flex gap-2">
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTH_NAMES.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </Select>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <div className="flex justify-center py-16 text-earth-dark">
          <LoaderCircle className="animate-spin" size={28} />
        </div>
      ) : (
        <>
          <Card>
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Wallet size={16} className="text-earth-dark" /> Total monthly budget
            </h2>
            <BudgetProgress
              label={`${MONTH_NAMES[month - 1]} ${year}`}
              spent={totalSpent}
              budget={totalBudget}
              onEdit={() => setEditing({ category: null, label: "Total monthly budget", amount: totalBudget })}
              onDelete={
                totalBudgetRow ? () => setPendingDelete({ id: totalBudgetRow.id, category: "total budget" }) : undefined
              }
            />
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Category budgets</h2>

            {categoryBudgets.length === 0 ? (
              <p className="mb-4 text-sm text-earth-dark">No category budgets set yet.</p>
            ) : (
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                {categoryBudgets.map((b) => (
                  <BudgetProgress
                    key={b.id}
                    label={b.category}
                    icon={getCategoryIcon(b.category)}
                    spent={spentByCategory[b.category] || 0}
                    budget={b.amount}
                    onEdit={() => setEditing({ category: b.category, label: b.category, amount: b.amount })}
                    onDelete={() => setPendingDelete(b)}
                  />
                ))}
              </div>
            )}

            {unbudgetedCategories.length > 0 && (
              <div className="flex flex-wrap items-end gap-2 border-t border-beige pt-4">
                <Select
                  label="Add a budget for"
                  value={addingCategory}
                  onChange={(e) => setAddingCategory(e.target.value)}
                  className="flex-1"
                >
                  <option value="">Choose a category…</option>
                  {unbudgetedCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
                <Button
                  variant="soft"
                  disabled={!addingCategory}
                  onClick={() => setEditing({ category: addingCategory, label: addingCategory, amount: null })}
                >
                  <Plus size={16} /> Add
                </Button>
              </div>
            )}
          </Card>
        </>
      )}

      <BudgetFormDialog
        open={Boolean(editing)}
        label={editing?.label || ""}
        initialAmount={editing?.amount}
        onSave={handleSaveBudget}
        onCancel={() => setEditing(null)}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove this budget?"
        message={pendingDelete ? `This removes the budget for "${pendingDelete.category}". Your spending data is not affected.` : ""}
        loading={deleting}
        onConfirm={confirmDeleteBudget}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  );
}