import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { parse, serialize } from "cookie";

const MAX_AGE = 60 * 60 * 24 * 7;

export const siteUrl = () => (process.env.SITE_URL || "").replace(/\/$/, "");
export const siteOrigin = () => new URL(siteUrl()).origin;
export const isSecure = () => siteUrl().startsWith("https://");

// Collects Set-Cookie values per response so a cookie name is only emitted once.
export function setCookie(res, name, value, opts = {}) {
  const jar = (res.__jar ??= new Map());
  jar.set(
    name,
    serialize(name, value, {
      httpOnly: true,
      secure: isSecure(),
      sameSite: "lax",
      path: "/",
      ...opts,
    })
  );
  res.setHeader("Set-Cookie", [...jar.values()]);
}

// Cookie-backed, user-scoped client. Uses the publishable key, so RLS applies.
export function createSupabase(req, res) {
  return createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return Object.entries(parse(req.headers.cookie ?? "")).map(([name, value]) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(list) {
        for (const { name, value, options } of list) {
          const maxAge = options?.maxAge === 0 ? 0 : Math.min(options?.maxAge ?? MAX_AGE, MAX_AGE);
          // Force the security attributes regardless of library defaults
          setCookie(res, name, value, { ...options, httpOnly: true, secure: isSecure(), sameSite: "lax", path: "/", maxAge });
        }
      },
    },
  });
}

// Expires every Supabase auth cookie (used on logout / account deletion)
export function clearAuthCookies(req, res) {
  for (const name of Object.keys(parse(req.headers.cookie ?? ""))) {
    if (name.startsWith("sb-")) setCookie(res, name, "", { maxAge: 0 });
  }
}

// Service-role client: used ONLY by rateLimit.js to call rate_limit_hit.
let admin;
export function adminClient() {
  admin ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}