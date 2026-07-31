import { supabase } from "../lib/supabase";

export async function getVillas() {
  const { data, error } = await supabase
    .from("villas")
    .select("*")
    .order("id");

  if (error) throw error;

  return data;
}