import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormShell from "./FormShell";
import AmountField from "./AmountField";
import DateTimeFields from "./DateTimeFields";
import Select from "../ui/Select";
import TextField from "../ui/TextField";
import TextArea from "../ui/TextArea";
import { FOOD_CATEGORIES } from "../../lib/categories";
import { createFoodExpense } from "../../services/expenseService";
import { nowDateAndTime } from "../../utils/nowParts";

export default function FoodForm({ onBack }) {
  const navigate = useNavigate();
  const [store, setStore] = useState("");
  const [item, setItem] = useState("");
  const [category, setCategory] = useState(FOOD_CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const { date, time } = nowDateAndTime();
  const [expenseDate, setExpenseDate] = useState(date);
  const [expenseTime, setExpenseTime] = useState(time);
  const [amountError, setAmountError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setAmountError("");

    const numericAmount = Number(amount);
    if (!amount || numericAmount <= 0) {
      setAmountError("Enter an amount greater than zero.");
      return;
    }
    if (!item.trim()) {
      toast.error("Please enter what you purchased.");
      return;
    }

    setSubmitting(true);
    try {
      await createFoodExpense({
        storeName: store.trim(),
        itemName: item.trim(),
        category,
        amount: numericAmount,
        date: expenseDate,
        time: expenseTime,
        notes,
        clientId: crypto.randomUUID(),
      });
      toast.success("Food expense saved!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Could not save this expense.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormShell title="Food" onBack={onBack} onSubmit={handleSubmit} submitting={submitting}>
      <TextField label="Store or restaurant" value={store} onChange={(e) => setStore(e.target.value)} placeholder="Jollibee" />
      <TextField label="Food or item purchased" required value={item} onChange={(e) => setItem(e.target.value)} placeholder="Chickenjoy with Rice" />
      <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
        {FOOD_CATEGORIES.map((c) => (
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
      <TextArea label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
    </FormShell>
  );
}