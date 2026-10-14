import { siteOrigin } from "./supabase.js";
import { ValidationError } from "./validate.js";

export function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(body);
}

export function clientIp(req) {
  return (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

// CSRF defence for cookie-authenticated, state-changing requests.
export function guardState(req, res) {
  if (req.headers.origin !== siteOrigin() || req.headers["x-pisopath-csrf"] !== "1") {
    send(res, 403, { error: "Forbidden" });
    return false;
  }
  return true;
}

export function handleError(res, e) {
  if (e instanceof ValidationError) return send(res, 400, { error: e.message });
  // Log codes only, never bodies, cookies or tokens
  console.error("api error:", e?.code || e?.status || e?.name || "unknown");
  if (e?.code === "23505") return send(res, 409, { error: "That already exists." });
  return send(res, 500, { error: "Something went wrong. Please try again." });
}