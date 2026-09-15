"use server";

import { createClient } from "@/lib/supabase/server";
import type { PaymentStatus } from "../types/order";
import { revalidatePath } from "next/cache";

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("UPDATE PAYMENT STATUS ERROR:", {
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
    message: "Payment status updated successfully.",
  };
}