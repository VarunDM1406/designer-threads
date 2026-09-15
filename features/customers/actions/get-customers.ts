"use server";

import { createClient } from "@/lib/supabase/server";
import type { Customer } from "../types/customer";

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      auth_user_id,
      first_name,
      last_name,
      email,
      phone,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET CUSTOMERS ERROR:", error);
    return [];
  }

  return data as Customer[];
}