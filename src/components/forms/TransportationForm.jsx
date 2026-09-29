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
import { createTransportationExpense } from "../../services/expenseService";
import { fetchFrequentRoutes, fetchFavoriteRoutes, saveFavoriteRoute } from "../../services/routeService";
import { nowDateAndTime } from "../../utils/nowParts";

export default function TransportationForm({ onBack }) {
  const navigate = useNavigate();
  const [type, setType] = useState(TRANSPORT_TYPES[0]);
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState("");
  const [notes, setNotes] = useState("");
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const { date, time } = nowDateAndTime();
  const [expenseDate, setExpenseDate] = useState(date);
  const [expenseTime, setExpenseTime] = useState(time);

  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [fareError, setFareError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFrequentRoutes().then(setSuggestions).catch(() => setSuggestions([]));
    fetchFavoriteRoutes().then(setFavorites).catch(() => setFavorites([]));
  }, []);

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
      const clientId = crypto.randomUUID();
      await createTransportationExpense({
        transportationType: type,
        startingPoint: start.trim(),
        destination: destination.trim(),
        fare: numericFare,
        date: expenseDate,
        time: expenseTime,
        notes,
        clientId,
      });

      if (saveAsFavorite) {
        await saveFavoriteRoute({
          transportationType: type,
          startingPoint: start.trim(),
          destination: destination.trim(),
          defaultFare: numericFare,
        }).catch(() => {}); // non-critical if it fails
      }

      toast.success("Transportation expense saved!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message || "Could not save this expense.");
    } finally {
      setSubmitting(false);
    }
  }

  const routeOptions = [...favorites, ...suggestions].slice(0, 5);

  return (
    <FormShell title="Transportation" onBack={onBack} onSubmit={handleSubmit} submitting={submitting}>
      {routeOptions.length > 0 && (
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

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={saveAsFavorite}
          onChange={(e) => setSaveAsFavorite(e.target.checked)}
          className="size-4 rounded accent-[#8A7650]"
        />
        <Star size={14} className="text-earth-dark" /> Save this route as a favorite
      </label>
    </FormShell>
  );
}