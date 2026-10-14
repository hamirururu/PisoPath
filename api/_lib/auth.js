import { createSupabase } from "./supabase.js";
import { send } from "./http.js";

// Identity always comes from a server-validated session (getUser hits Supabase Auth),
// never from anything the browser sends.
export async function requireUser(req, res) {
  const supabase = createSupabase(req, res);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    send(res, 401, { error: "Not authenticated" });
    return null;
  }
  return { supabase, user: data.user };
}

export const publicUser = (u) => ({
  id: u.id,
  email: u.email,
  user_metadata: {
    full_name: u.user_metadata?.full_name ?? "",
    avatar_url: u.user_metadata?.avatar_url ?? null,
    date_format: u.user_metadata?.date_format ?? "long",
  },
});