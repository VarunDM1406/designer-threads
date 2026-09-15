"use server";

import { createClient } from "@/lib/supabase/server";

export async function autoConfirmOrder(orderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "auto_confirm_order",
    {
      p_order_id: orderId,
    }
  );

  if (error) {
    console.error("AUTO CONFIRM ERROR:", {
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

  if (!data) {
    return {
      success: true,
      message: "Order was not pending or does not belong to this customer.",
    };
  }

  return {
    success: true,
    message: "Order automatically confirmed.",
  };
}