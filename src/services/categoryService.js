import { supabase } from "../lib/supabase";

export async function fetchCustomCategories() {
  const { data, error } = await supabase
    .from("custom_categories")
    .select("id, name, icon")
    .order("name");
  if (error) throw error;
  return data;
}

export async function createCustomCategory(name, icon = "tag") {
  const { data, error } = await supabase
    .from("custom_categories")
    .insert({ name, icon })
    .select("id, name, icon")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCustomCategory(id) {
  const { error } = await supabase.from("custom_categories").delete().eq("id", id);
  if (error) throw error;
}