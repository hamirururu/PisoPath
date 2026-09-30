import { useState } from "react";
import toast from "react-hot-toast";
import { LoaderCircle, Plus, Trash2 } from "lucide-react";
import SettingsSection from "./SettingsSection";
import TextField from "../ui/TextField";
import Button from "../ui/Button";
import { useCategories } from "../../hooks/useCategories";
import { createCustomCategory, deleteCustomCategory } from "../../services/categoryService";

export default function CategoryManager() {
  const { customCategories, loading, refresh } = useCategories(true);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    if (adding || !name.trim()) return;
    setAdding(true);
    try {
      await createCustomCategory(name.trim());
      setName("");
      toast.success("Category added.");
      refresh();
    } catch (err) {
      toast.error(err.message?.includes("duplicate") ? "That category already exists." : err.message || "Could not add category.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await deleteCustomCategory(id);
      toast.success("Category removed.");
      refresh();
    } catch (err) {
      toast.error(err.message || "Could not remove category.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <SettingsSection title="Custom categories" description="Add your own categories for 'Other' expenses.">
      <form onSubmit={handleAdd} className="flex items-end gap-2">
        <TextField
          label="New category name"
          className="flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Pet Care"
        />
        <Button type="submit" disabled={adding || !name.trim()}>
          {adding ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}
        </Button>
      </form>

      {loading ? (
        <p className="text-sm text-earth-dark">Loading…</p>
      ) : customCategories.length === 0 ? (
        <p className="text-sm text-earth-dark">No custom categories yet.</p>
      ) : (
        <ul className="divide-y divide-beige/60">
          {customCategories.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-2.5">
              <span className="text-sm">{c.name}</span>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={deletingId === c.id}
                aria-label={`Delete ${c.name}`}
                className="grid size-8 place-items-center rounded-full text-danger hover:bg-danger-soft disabled:opacity-50"
              >
                {deletingId === c.id ? <LoaderCircle size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </SettingsSection>
  );
}