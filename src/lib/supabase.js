import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Missing Supabase settings. Fill in .env.local (see .env.example) and restart npm run dev."
  );
}

// Only the public (publishable/anon) key is ever used in frontend code.
export const supabase = createClient(url, key);