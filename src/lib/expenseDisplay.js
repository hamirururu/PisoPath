import { getCategoryIcon, getTransportIcon } from "./categoryIcons";

// Normalizes how one expense row is shown (title, subtitle, icon),
// since transportation and food rows carry extra fields.
export function getExpenseDisplay(expense) {
  if (expense.category === "Transportation" && expense.transportation_details) {
    const t = Array.isArray(expense.transportation_details)
      ? expense.transportation_details[0]
      : expense.transportation_details;
    return {
      title: t?.transportation_type || "Transportation",
      subtitle: t ? `${t.starting_point} → ${t.destination}` : expense.expense_name,
      Icon: getTransportIcon(t?.transportation_type),
    };
  }

  if (expense.category === "Food") {
    return {
      title: expense.store_name || expense.expense_name,
      subtitle: [expense.expense_name, expense.subcategory].filter(Boolean).join(" · "),
      Icon: getCategoryIcon("Food"),
    };
  }

  return {
    title: expense.expense_name,
    subtitle: expense.category,
    Icon: getCategoryIcon(expense.category),
  };
}