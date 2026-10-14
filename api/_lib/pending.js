import { createHmac, timingSafeEqual } from "node:crypto";
import { parse } from "cookie";
import { setCookie } from "./supabase.js";

const NAME = "pp_pending";
const PATH = "/api/auth";
const TTL_MS = 60 * 60 * 1000;
export const COOLDOWN_SECONDS = 60;

const sign = (payload) => createHmac("sha256", process.env.PENDING_COOKIE_SECRET).update(payload).digest("base64url");

export function setPending(res, email, availableAt) {
  const payload = Buffer.from(JSON.stringify({ e: email, a: availableAt, x: Date.now() + TTL_MS })).toString("base64url");
  setCookie(res, NAME, `${payload}.${sign(payload)}`, { path: PATH, maxAge: TTL_MS / 1000 });
}

export function readPending(req) {
  const raw = parse(req.headers.cookie ?? "")[NAME];
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.e || data.x < Date.now()) return null;
    return { email: data.e, availableAt: data.a };
  } catch {
    return null;
  }
}

export function clearPending(res) {
  setCookie(res, NAME, "", { path: PATH, maxAge: 0 });
}

export function maskEmail(email) {
  const [user, domain] = email.split("@");
  return `${user[0]}${"*".repeat(Math.max(2, Math.min(user.length - 1, 6)))}@${domain}`;
}