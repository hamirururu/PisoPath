import { createSupabase, siteUrl } from "../_lib/supabase.js";
import { clearPending } from "../_lib/pending.js";

const TYPES = ["email", "signup", "recovery"];

function redirect(res, path) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer"); // keep the token URL out of Referer headers
  res.setHeader("Location", `${siteUrl()}${path}`); // hard-coded destinations: no open redirect
  res.status(302).end();
}

export default async function handler(req, res) {
  const { token_hash, type } = req.query;
  if (typeof token_hash !== "string" || !/^[\w-]{10,200}$/.test(token_hash) || !TYPES.includes(type)) {
    return redirect(res, "/login?notice=link_invalid");
  }

  const supabase = createSupabase(req, res);
  const { error } = await supabase.auth.verifyOtp({ type, token_hash });
  if (error) {
    console.error("confirm error:", error.code || error.status);
    return redirect(res, `/login?notice=${error.code === "otp_expired" ? "link_expired" : "link_invalid"}`);
  }
  clearPending(res);
  return redirect(res, type === "recovery" ? "/reset-password" : "/");
}