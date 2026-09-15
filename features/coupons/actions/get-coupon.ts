"use server";

import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "../types/coupon";

export async function getCoupon(
  id: string
): Promise<Coupon | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("GET COUPON ERROR:", error);
    return null;
  }

  return data as Coupon;
}