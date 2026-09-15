"use server";

import { createClient } from "@/lib/supabase/server";
import type { Order } from "../types/order";

export async function getOrders(): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
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
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("=== GET ORDERS ERROR ===");
    console.error("message:", error.message);
    console.error("details:", error.details);
    console.error("hint:", error.hint);
    console.error("code:", error.code);

    return [];
  }

  return (data ?? []).map((order) => ({
    ...order,
    status: order.order_status,
    payment_status: order.payment_status,
    subtotal: Number(order.subtotal) || 0,
    discount: Number(order.discount) || 0,
    shipping_charge: Number(order.shipping_charge) || 0,
    total: Number(order.total) || 0,
    order_items: order.order_items ?? [],
  })) as Order[];
}