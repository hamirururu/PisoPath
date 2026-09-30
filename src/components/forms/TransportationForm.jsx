import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import FormShell from "./FormShell";
import AmountField from "./AmountField";
import DateTimeFields from "./DateTimeFields";
import Select from "../ui/Select";
import TextField from "../ui/TextField";
import TextArea from "../ui/TextArea";
import Card from "../ui/Card";
import { TRANSPORT_TYPES } from "../../lib/categories";
import { createTransportationExpense, updateTransportationExpense } from "../../services/expenseService";
import { fetchFrequentRoutes, fetchFavoriteRoutes, saveFavoriteRoute } from "../../services/routeService";
import { nowDateAndTime } from "../../utils/nowParts";

export default function TransportationForm({ onBack, expense, onSaved }) {
  const navigate = useNavigate();
  const isEdit = Boolean(expense);
  const detail = isEdit
    ? (Array.isArray(expense.transportation_details) ? expense.transportation_details[0] : expense.transportation_details)
    : null;

  const [type, setType] = useState(detail?.transportation_type || TRANSPORT_TYPES[0]);
  const [start, setStart] = useState(detail?.starting_point || "");
  const [destination, setDestination] = useState(detail?.destination || "");
  const [fare, setFare] = useState(isEdit ? String(expense.amount) : "");
  const [notes, setNotes] = useState(expense?.notes || "");
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const defaults = nowDateAndTime();
  const [expenseDate, setExpenseDate] = useState(expense?.expense_date || defaults.date);
  const [expenseTime, setExpenseTime] = useState(expense?.expense_time?.slice(0, 5) || defaults.time);

  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [fareError, setFareError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) return; // no need for quick-fill suggestions while editing
    fetchFrequentRoutes().then(setSuggestions).catch(() => setSuggestions([]));
    fetchFavoriteRoutes().then(setFavorites).catch(() => setFavorites([]));
  }, [isEdit]);

  function applyRoute(route) {
    setType(route.transportation_type);
    setStart(route.starting_point);
    setDestination(route.destination);
    if (route.default_fare) setFare(String(route.default_fare));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setFareError("");

    const numericFare = Number(fare);
    if (!fare || numericFare <= 0) {
      setFareError("Enter a fare amount greater than zero.");
      return;
    }
    if (!start.trim() || !destination.trim()) {
      toast.error("Please fill in starting point and destination.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateTransportationExpense(expense.id, {
          transportationType: type,
          startingPoint: start.trim(),
          destination: destination.trim(),
          fare: numericFare,
          date: expenseDate,
          time: expenseTime,
          notes,
        });
        toast.success("Transportation expense updated!");
        onSaved?.();
      } else {
        await createTransportationExpense({
          transportationType: type,
          startingPoint: start.trim(),
          destination: destination.trim(),
          fare: numericFare,
          date: expenseDate,
          time: expenseTime,
          notes,
          clientId: crypto.randomUUID(),
        });
        if (saveAsFavorite) {
          await saveFavoriteRoute({
            transportationType: type,
            startingPoint: start.trim(),
            destination: destination.trim(),
            defaultFare: numericFare,
          }).catch(() => {});
        }
        toast.success("Transportation expense saved!");
        navigate("/", { replace: true });
      }
    } catch (err) {
      toast.error(err.message || "Could not save this expense.");
    } finally {
      setSubmitting(false);
    }
  }

  const routeOptions = [...favorites, ...suggestions].slice(0, 5);

  return (
    <FormShell
      title={isEdit ? "Edit Transportation" : "Transportation"}
      onBack={onBack}
      onSubmit={handleSubmit}
      submitting={submitting}
    >
      {!isEdit && routeOptions.length > 0 && (
        <Card className="p-4">
          <p className="mb-3 text-xs font-medium text-earth-dark">Quick fill from a recent route</p>
          <div className="flex flex-wrap gap-2">
            {routeOptions.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyRoute(r)}
                className="rounded-full bg-beige/50 px-3 py-1.5 text-xs font-medium hover:bg-beige"
              >
                {r.starting_point} → {r.destination}
              </button>
            ))}
          </div>
        </Card>
      )}

      <Select label="Transportation type" value={type} onChange={(e) => setType(e.target.value)}>
        {TRANSPORT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </Select>

      <TextField label="Starting point" required value={start} onChange={(e) => setStart(e.target.value)} placeholder="SM North" />
      <TextField label="Destination" required value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="SM Fairview" />
      <AmountField label="Fare amount (₱)" value={fare} onChange={(e) => setFare(e.target.value)} error={fareError} />
      <DateTimeFields
        date={expenseDate}
        time={expenseTime}
        onDateChange={(e) => setExpenseDate(e.target.value)}
        onTimeChange={(e) => setExpenseTime(e.target.value)}
      />
      <TextArea label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional details" />

      {!isEdit && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={saveAsFavorite}
            onChange={(e) => setSaveAsFavorite(e.target.checked)}
            className="size-4 rounded accent-[#8A7650]"
          />
          <Star size={14} className="text-earth-dark" /> Save this route as a favorite
        </label>
      )}
    </FormShell>
  );
}