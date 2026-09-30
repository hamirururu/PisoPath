import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bus, ShoppingBag, UtensilsCrossed } from "lucide-react";
import Card from "../components/ui/Card";
import TransportationForm from "../components/forms/TransportationForm";
import FoodForm from "../components/forms/FoodForm";
import OtherExpenseForm from "../components/forms/OtherExpenseForm";

const options = [
  { key: "Transportation", label: "Transportation", icon: Bus, desc: "Jeepney, Grab, MRT, and more" },
  { key: "Food", label: "Food", icon: UtensilsCrossed, desc: "Meals, snacks, and drinks" },
  { key: "other", label: "Other Expenses", icon: ShoppingBag, desc: "Shopping, bills, and everything else" },
];

export default function AddExpense() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingExpense = location.state?.expense || null;

  const initialSelected = editingExpense
    ? (editingExpense.category === "Transportation" || editingExpense.category === "Food"
        ? editingExpense.category
        : "other")
    : null;

  const [selected, setSelected] = useState(initialSelected);

  function goBack() {
    if (editingExpense) navigate("/history");
    else setSelected(null);
  }

  function afterEditSaved() {
    navigate("/history");
  }

  if (selected === "Transportation")
    return <TransportationForm onBack={goBack} expense={editingExpense || undefined} onSaved={afterEditSaved} />;
  if (selected === "Food")
    return <FoodForm onBack={goBack} expense={editingExpense || undefined} onSaved={afterEditSaved} />;
  if (selected === "other")
    return <OtherExpenseForm onBack={goBack} expense={editingExpense || undefined} onSaved={afterEditSaved} />;

  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-semibold">Add Expense</h1>
      <p className="text-sm text-earth-dark">What did you spend on?</p>

      <div className="grid gap-3 sm:grid-cols-3">
        {options.map(({ key, label, icon: Icon, desc }) => (
          <button key={key} onClick={() => setSelected(key)} className="text-left">
            <Card className="flex h-full flex-col items-start gap-3 transition-transform active:scale-[0.98]">
              <span className="grid size-12 place-items-center rounded-2xl bg-sage/25 text-earth-dark">
                <Icon size={24} />
              </span>
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-xs text-earth-dark">{desc}</p>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </section>
  );
}