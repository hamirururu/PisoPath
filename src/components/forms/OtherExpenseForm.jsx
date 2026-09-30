import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormShell from "./FormShell";
import AmountField from "./AmountField";
import DateTimeFields from "./DateTimeFields";
import Select from "../ui/Select";
import TextField from "../ui/TextField";
import TextArea from "../ui/TextArea";
import { useCategories } from "../../hooks/useCategories";
import { createOtherExpense, updateOtherExpense } from "../../services/expenseService";
import { nowDateAndTime } from "../../utils/nowParts";

export default function OtherExpenseForm({ onBack, expense, onSaved }) {
  const navigate = useNavigate();
  const isEdit = Boolean(expense);
  const { allCategories, loading: loadingCategories } = useCategories();

  const [name, setName] = useState(expense?.expense_name || "");
  const [category, setCategory] = useState(expense?.category || "");
  const [amount, setAmount] = useState(isEdit ? String(expense.amount) : "");
  const [notes, setNotes] = useState(expense?.notes || "");
  const defaults = nowDateAndTime();
  const [expenseDate, setExpenseDate] = useState(expense?.expense_date || defaults.date);
  const [expenseTime, setExpenseTime] = useState(expense?.expense_time?.slice(0, 5) || defaults.time);
  const [amountError, setAmountError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const effectiveCategory = category || allCategories[0] || "Other";

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setAmountError("");

    const numericAmount = Number(amount);
    if (!amount || numericAmount <= 0) {
      setAmountError("Enter an amount greater than zero.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter an expense name.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateOtherExpense(expense.id, {
          expenseName: name.trim(),
          category: effectiveCategory,
          amount: numericAmount,
          date: expenseDate,
          time: expenseTime,
          notes,
        });
        toast.success("Expense updated!");
        onSaved?.();
      } else {
        await createOtherExpense({
          expenseName: name.trim(),
          category: effectiveCategory,
          amount: numericAmount,
          date: expenseDate,
          time: expenseTime,
          notes,
          clientId: crypto.randomUUID(),
        });
        toast.success("Expense saved!");
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Could not save this expense.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormShell title={isEdit ? "Edit Expense" : "Other Expense"} onBack={onBack} onSubmit={handleSubmit} submitting={submitting}>
      <TextField label="Expense name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Personal care items" />
      <Select label="Category" value={effectiveCategory} onChange={(e) => setCategory(e.target.value)} disabled={loadingCategories}>
        {allCategories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </Select>
      <AmountField value={amount} onChange={(e) => setAmount(e.target.value)} error={amountError} />
      <DateTimeFields
        date={expenseDate}
        time={expenseTime}
        onDateChange={(e) => setExpenseDate(e.target.value)}
        onTimeChange={(e) => setExpenseTime(e.target.value)}
      />
      <TextArea label="Description or notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
    </FormShell>
  );
}