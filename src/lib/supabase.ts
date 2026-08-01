import { createClient } from "@supabase/supabase-js";

function normalizeSupabaseUrl(value: string) {
  return value.replace(/\/rest\/v1\/?$/i, "");
}

export const supabase = createClient(
  normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL!),
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);