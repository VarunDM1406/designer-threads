"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteCoupon(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE COUPON ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message);
  }

  revalidatePath("/admin/coupons");

  return { success: true };
}