import { createHash } from "node:crypto";
import { adminClient } from "./supabase.js";

export const emailKey = (email) =>
  createHash("sha256").update(`${process.env.PENDING_COOKIE_SECRET}:${email}`).digest("hex").slice(0, 32);

// Fails CLOSED: if the limiter is unreachable, the request is refused.
export async function hit(key, max, windowSeconds) {
  const { data, error } = await adminClient().rpc("rate_limit_hit", {
    p_key: key, p_max: max, p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("rate limiter error:", error.code || "unknown");
    return { allowed: false, retryAfter: 30 };
  }
  const row = Array.isArray(data) ? data[0] : data;
  return { allowed: row.allowed, retryAfter: row.retry_after };
}