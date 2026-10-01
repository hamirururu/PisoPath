import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// supabase-js appends "rest/v1" to whatever URL it is given, so a URL copied
// from the dashboard's REST section produces a doubled path and every request
// fails with "Invalid path specified in request URL". Catch it at build time.
const malformedUrl = url && /\/rest\/v\d+\/?$/.test(url);
const badUrlMessage = malformedUrl
  ? `VITE_SUPABASE_URL looks wrong: "${url}" already includes the API path. Use the bare project origin (https://your-project-ref.supabase.co) instead.`
  : "";

// Vite inlines VITE_* at build time, so a deployment without these set gets
// undefined here. Do NOT throw at module scope: this file is in the entry import
// chain, so a top-level throw kills the bundle before React mounts and the user
// sees a blank white page with nothing to go on. Surface the reason instead.
const missingVars =
  url && key
    ? ""
    : "Missing Supabase settings. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local locally, or as environment variables on your host (Vercel: Project → Settings → Environment Variables), then rebuild.";

export const configError = missingVars || badUrlMessage;

function missingConfig() {
  throw new Error(configError);
}

// Only the public (publishable/anon) key is ever used in frontend code.
// Unconfigured, stand in a stub that throws the real reason on first use, so
// callers see a useful message rather than "cannot read .from of null".
export const supabase = configError
  ? {
      from: missingConfig,
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      },
    }
  : createClient(url, key, {
      auth: {
        persistSession: true,
        // Served from a *.vercel.app subdomain, where third-party cookies are
        // blocked; naming the key keeps the session in this origin's storage.
        storageKey: "pisopath-auth",
      },
    });