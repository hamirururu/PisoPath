import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Vite inlines VITE_* at build time, so a deployment without these set gets
// undefined here. Do NOT throw at module scope: this file is in the entry import
// chain, so a top-level throw kills the bundle before React mounts and the user
// sees a blank white page with nothing to go on. Surface the reason instead.
export const configError =
  url && key
    ? ""
    : "Missing Supabase settings. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local locally, or as environment variables on your host (Vercel: Project → Settings → Environment Variables), then rebuild.";

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