import { createSupabase, clearAuthCookies, siteUrl } from "../_lib/supabase.js";
import { send, guardState, clientIp, handleError } from "../_lib/http.js";
import { requireUser, publicUser } from "../_lib/auth.js";
import { hit, emailKey } from "../_lib/rateLimit.js";
import { setPending, readPending, clearPending, maskEmail, COOLDOWN_SECONDS } from "../_lib/pending.js";
import * as v from "../_lib/validate.js";

const isRateLimit = (e) => e?.status === 429 || /rate_limit/.test(e?.code || "");
const tooMany = (res, retryAfter = 60) =>
  send(res, 429, { error: "Too many requests. Please wait and try again.", retryAfter });

export default async function handler(req, res) {
  try {
    const { action } = req.query;

    if (action === "me" && req.method === "GET") {
      const supabase = createSupabase(req, res);
      const { data } = await supabase.auth.getUser();
      return send(res, 200, { user: data?.user ? publicUser(data.user) : null });
    }

    if (action === "pending" && req.method === "GET") {
      const p = readPending(req);
      if (!p) return send(res, 200, { pending: false });
      return send(res, 200, {
        pending: true,
        email: maskEmail(p.email),
        resendAvailableAt: p.availableAt,
        serverNow: Date.now(),
      });
    }

    if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
    if (!guardState(req, res)) return;
    const body = req.body ?? {};

    switch (action) {
      case "signup": {
        const email = v.email(body.email);
        const password = v.password(body.password);
        const fullName = v.str(body.fullName, "Name", 1, 80);

        const ip = await hit(`signup:ip:${clientIp(req)}`, 5, 3600);
        if (!ip.allowed) return tooMany(res, ip.retryAfter);
        const mail = await hit(`mail:${emailKey(email)}`, 1, COOLDOWN_SECONDS);
        if (!mail.allowed) return tooMany(res, mail.retryAfter);

        const supabase = createSupabase(req, res);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName }, emailRedirectTo: `${siteUrl()}/auth/confirm` },
        });
        if (error) {
          if (isRateLimit(error)) return tooMany(res);
          if (error.code === "weak_password") return send(res, 400, { error: "Choose a stronger password." });
          console.error("signup error:", error.code || error.status);
          return send(res, 400, { error: "Could not create your account." });
        }
        // Existing accounts return an obfuscated user, so the response is identical either way.
        if (data.session) return send(res, 200, { status: "signed_in", user: publicUser(data.user) });

        const availableAt = Date.now() + COOLDOWN_SECONDS * 1000;
        setPending(res, email, availableAt);
        return send(res, 200, { status: "pending" });
      }

      case "login": {
        const email = v.email(body.email);
        if (typeof body.password !== "string" || !body.password) return send(res, 400, { error: "Enter your password." });

        const ip = await hit(`login:ip:${clientIp(req)}`, 20, 300);
        const acct = await hit(`login:acct:${emailKey(email)}`, 8, 900);
        if (!ip.allowed || !acct.allowed) return tooMany(res, Math.max(ip.retryAfter, acct.retryAfter));

        const supabase = createSupabase(req, res);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: body.password });
        if (error) {
          if (error.code === "email_not_confirmed") {
            setPending(res, email, Date.now());
            return send(res, 403, { error: "Please confirm your email first.", code: "email_not_confirmed" });
          }
          return send(res, 401, { error: "Invalid email or password." });
        }
        clearPending(res);
        return send(res, 200, { user: publicUser(data.user) });
      }

      case "resend": {
        const pending = readPending(req); // email comes ONLY from the signed cookie
        if (!pending) return send(res, 409, { error: "No pending signup.", code: "no_pending" });

        const ip = await hit(`resend:ip:${clientIp(req)}`, 10, 3600);
        if (!ip.allowed) return tooMany(res, ip.retryAfter);
        const mail = await hit(`mail:${emailKey(pending.email)}`, 1, COOLDOWN_SECONDS);
        if (!mail.allowed) return tooMany(res, mail.retryAfter);

        const supabase = createSupabase(req, res);
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: pending.email,
          options: { emailRedirectTo: `${siteUrl()}/auth/confirm` },
        });
        if (error) {
          if (isRateLimit(error)) return tooMany(res);
          console.error("resend error:", error.code || error.status);
          return send(res, 502, { error: "We couldn't send the email. Please try again shortly." });
        }
        const availableAt = Date.now() + COOLDOWN_SECONDS * 1000;
        setPending(res, pending.email, availableAt);
        return send(res, 200, { ok: true, resendAvailableAt: availableAt, serverNow: Date.now() });
      }

      case "cancel-pending":
        clearPending(res);
        return send(res, 200, { ok: true });

      case "logout": {
        const supabase = createSupabase(req, res);
        await supabase.auth.signOut({ scope: "local" }).catch(() => {});
        clearAuthCookies(req, res);
        return send(res, 200, { ok: true });
      }

      case "forgot": {
        const email = v.email(body.email);
        const ip = await hit(`forgot:ip:${clientIp(req)}`, 5, 3600);
        const mail = await hit(`mail:${emailKey(email)}`, 1, COOLDOWN_SECONDS);
        if (ip.allowed && mail.allowed) {
          const supabase = createSupabase(req, res);
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${siteUrl()}/auth/confirm/recovery`,
          });
          if (error) console.error("forgot error:", error.code || error.status);
        }
        return send(res, 200, { ok: true }); // identical response: no account enumeration
      }

      case "update-password": {
        const ctx = await requireUser(req, res);
        if (!ctx) return;
        const { error } = await ctx.supabase.auth.updateUser({ password: v.password(body.password) });
        if (error) return send(res, 400, { error: "Could not update your password." });
        return send(res, 200, { ok: true });
      }

      default:
        return send(res, 404, { error: "Not found" });
    }
  } catch (e) {
    return handleError(res, e);
  }
}