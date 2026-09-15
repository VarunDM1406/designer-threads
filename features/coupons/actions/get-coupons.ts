"use server";

import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "../types/coupon";

export async function getCoupons(): Promise<Coupon[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET COUPONS ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return [];
  }

  return (data ?? []) as Coupon[];
}