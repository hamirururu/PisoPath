import { supabase } from "../lib/supabase";

const SELECT_WITH_TRANSPORT = `
  id, category, expense_name, store_name, subcategory, amount,
  expense_date, expense_time, notes, created_at,
  transportation_details ( transportation_type, starting_point, destination )
`;

export async function fetchExpensesBetween(startDate, endDate) {
  const { data, error } = await supabase
    .from("expenses")
    .select(SELECT_WITH_TRANSPORT)
    .gte("expense_date", startDate)
    .lte("expense_date", endDate)
    .order("expense_date", { ascending: false })
    .order("expense_time", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchRecentExpenses(limit = 6) {
  const { data, error } = await supabase
    .from("expenses")
    .select(SELECT_WITH_TRANSPORT)
    .order("expense_date", { ascending: false })
    .order("expense_time", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// Lightweight: only the columns needed for totals, so large histories
// don't pull full rows just to sum them.
export async function fetchAllAmounts() {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount, category, expense_date");
  if (error) throw error;
  return data;
}

export async function createTransportationExpense({
  transportationType, startingPoint, destination, fare, date, time, notes, clientId,
}) {
  const { data: expense, error } = await supabase
    .from("expenses")
    .insert({
      category: "Transportation",
      expense_name: `${transportationType} fare`,
      amount: fare,
      expense_date: date,
      expense_time: time,
      notes: notes || null,
      client_id: clientId,
    })
    .select("id")
    .single();
  if (error) throw error;

  const { error: detailError } = await supabase.from("transportation_details").insert({
    expense_id: expense.id,
    transportation_type: transportationType,
    starting_point: startingPoint,
    destination,
  });
  if (detailError) throw detailError;

  return expense.id;
}

export async function createFoodExpense({
  storeName, itemName, category, amount, date, time, notes, clientId,
}) {
  const { error } = await supabase.from("expenses").insert({
    category: "Food",
    expense_name: itemName,
    store_name: storeName,
    subcategory: category,
    amount,
    expense_date: date,
    expense_time: time,
    notes: notes || null,
    client_id: clientId,
  });
  if (error) throw error;
}

export async function createOtherExpense({
  expenseName, category, amount, date, time, notes, clientId,
}) {
  const { error } = await supabase.from("expenses").insert({
    category,
    expense_name: expenseName,
    amount,
    expense_date: date,
    expense_time: time,
    notes: notes || null,
    client_id: clientId,
  });
  if (error) throw error;
}

export async function fetchExpenseById(id) {
  const { data, error } = await supabase
    .from("expenses")
    .select(SELECT_WITH_TRANSPORT)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(id) {
  // transportation_details rows cascade automatically via the FK
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

export async function updateTransportationExpense(id, {
  transportationType, startingPoint, destination, fare, date, time, notes,
}) {
  const { error: expenseError } = await supabase
    .from("expenses")
    .update({
      expense_name: `${transportationType} fare`,
      amount: fare,
      expense_date: date,
      expense_time: time,
      notes: notes || null,
    })
    .eq("id", id);
  if (expenseError) throw expenseError;

  const { error: detailError } = await supabase
    .from("transportation_details")
    .update({
      transportation_type: transportationType,
      starting_point: startingPoint,
      destination,
    })
    .eq("expense_id", id);
  if (detailError) throw detailError;
}

export async function updateFoodExpense(id, { storeName, itemName, category, amount, date, time, notes }) {
  const { error } = await supabase
    .from("expenses")
    .update({
      expense_name: itemName,
      store_name: storeName,
      subcategory: category,
      amount,
      expense_date: date,
      expense_time: time,
      notes: notes || null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function updateOtherExpense(id, { expenseName, category, amount, date, time, notes }) {
  const { error } = await supabase
    .from("expenses")
    .update({
      expense_name: expenseName,
      category,
      amount,
      expense_date: date,
      expense_time: time,
      notes: notes || null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchAllExpensesFull() {
  const { data, error } = await supabase
    .from("expenses")
    .select(SELECT_WITH_TRANSPORT)
    .order("expense_date", { ascending: false })
    .order("expense_time", { ascending: false });
  if (error) throw error;
  return data;
}

export async function fetchTransportationExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select(SELECT_WITH_TRANSPORT)
    .eq("category", "Transportation")
    .order("expense_date", { ascending: false })
    .order("expense_time", { ascending: false });
  if (error) throw error;
  return data;
}