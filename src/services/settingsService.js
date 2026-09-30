import { supabase } from "../lib/supabase";

export async function updateFullName(fullName) {
  const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
  if (error) throw error;
}

export async function updateDateFormat(format) {
  const { error } = await supabase.auth.updateUser({ data: { date_format: format } });
  if (error) throw error;
}

export async function deleteMyAccount() {
  const { error } = await supabase.rpc("delete_my_account");
  if (error) throw error;
}