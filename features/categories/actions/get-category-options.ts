"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCategoryOptions() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}