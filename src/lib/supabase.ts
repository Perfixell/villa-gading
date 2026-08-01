import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(value: string) {
  const cleaned = value.trim().replace(/^['"]|['"]$/g, "");
  const url = new URL(cleaned);

  // Supabase JS appends /rest/v1 itself. Deployment secrets are sometimes
  // copied from a REST example with that path included.
  url.pathname = url.pathname.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "");
  url.search = "";
  url.hash = "";

  if (!url.hostname.endsWith(".supabase.co")) {
    throw new Error("VITE_SUPABASE_URL must be a Supabase project URL.");
  }

  return url.toString().replace(/\/$/, "");
}

export const supabase = createClient(
  normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL!),
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);
