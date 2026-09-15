"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleCoupon(
  id: string,
  isActive: boolean
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("coupons")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("TOGGLE COUPON ERROR:", error);
    throw new Error(error.message);
  }

  return { success: true };
}