"use server";

import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "../types/coupon";

export async function getAvailableCoupons(
  subtotal: number
): Promise<Coupon[]> {
  const supabase = await createClient();

  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .lte("minimum_order_amount", subtotal)
    .order("discount_value", { ascending: false });

  if (error) {
    console.error("GET AVAILABLE COUPONS ERROR:", error);
    return [];
  }

  return (data ?? [])
    .filter(
      (coupon) =>
        coupon.usage_limit === null ||
        coupon.usage_count < coupon.usage_limit
    )
    .filter(
      (coupon) =>
        !coupon.expires_at || new Date(coupon.expires_at) >= new Date()
    ) as Coupon[];
}
