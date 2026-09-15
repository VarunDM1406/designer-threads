"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order } from "../types/order";

export async function getOrder(
  id: string
): Promise<Order | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      profile:profiles (
        id,
        email,
        first_name,
        last_name,
        phone
      ),
      shipping_address:addresses (
        id,
        full_name,
        phone,
        address_line_1,
        city,
        state,
        country,
        postal_code
      ),
      order_items (
        id,
        product_variant_id,
        product_name,
        product_sku,
        size,
        color,
        unit_price,
        quantity,
        total_price,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("=== GET ORDER ERROR ===");
    console.error("message:", error.message);
    console.error("details:", error.details);
    console.error("hint:", error.hint);
    console.error("code:", error.code);

    return null;
  }

  const order: Order = {
  id: data.id,
  order_number: data.order_number,

  customer_name:
    `${data.profile?.first_name ?? ""} ${data.profile?.last_name ?? ""}`.trim(),

  customer_email: data.profile?.email ?? null,

  customer_phone:
    data.profile?.phone ??
    data.shipping_address?.phone ??
    "",

  subtotal: Number(data.subtotal) || 0,
  discount: Number(data.discount) || 0,

  shipping_charge: Number(data.shipping_charge) || 0,

  total: Number(data.total) || 0,

  payment_method: data.payment_method ?? null,
  payment_status: data.payment_status,
  status: data.order_status,

  tracking_number: data.tracking_number ?? null,
  notes: data.customer_note ?? null,

  created_at: data.created_at,
  updated_at: data.updated_at,

  profile: data.profile ?? null,
  shipping_address: data.shipping_address ?? null,

  order_items: data.order_items ?? [],
};

return order;
}