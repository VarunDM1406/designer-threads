"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteOrder(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete order:", error);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Order deleted successfully.",
  };
}