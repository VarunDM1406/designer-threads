"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "../types/order";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      order_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE ORDER STATUS ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);

  return {
    success: true,
    message: "Order status updated successfully.",
  };
}