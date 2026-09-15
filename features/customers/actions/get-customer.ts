"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCustomer(id: string) {
  const supabase = await createClient();

  const { data: customer, error: customerError } = await supabase
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
    .eq("id", id)
    .single();

  if (customerError || !customer) {
    console.error("GET CUSTOMER ERROR:", customerError);
    return null;
  }

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      total,
      payment_status,
      order_status,
      created_at
    `)
    .eq("profile_id", id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("GET CUSTOMER ORDERS ERROR:", ordersError);
  }

  return {
    ...customer,
    orders: orders || [],
  };
}