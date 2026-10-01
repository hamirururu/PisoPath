import { supabase } from "../lib/supabase";

export async function fetchBudgets(month, year) {
  const { data, error } = await supabase
    .from("budgets")
    .select("id, category, amount, month, year")
    .eq("month", month)
    .eq("year", year);
  if (error) throw error;
  return data;
}

// category: null for the total monthly budget, or a category name.
// Supabase upsert's onConflict can't target a partial/coalesce unique index,
// so this does a manual find-then-update-or-insert instead.
export async function upsertBudget({ category, amount, month, year }) {
  let query = supabase.from("budgets").select("id").eq("month", month).eq("year", year);
  query = category ? query.eq("category", category) : query.is("category", null);
  const { data: existing, error: findError } = await query.maybeSingle();
  if (findError) throw findError;

  if (existing) {
    const { error } = await supabase.from("budgets").update({ amount }).eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("budgets").insert({ category, amount, month, year });
    if (error) throw error;
  }
}

export async function deleteBudget(id) {
  const { error } = await supabase.from("budgets").delete().eq("id", id);
  if (error) throw error;
}