"use server";

import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "../types/coupon";

export type ValidateCouponResult =
  | { success: true; coupon: Coupon; discountAmount: number }
  | { success: false; message: string };

export async function validateCoupon(
  code: string,
  subtotal: number,
  profileId?: string | null
): Promise<ValidateCouponResult> {
  const trimmed = code.trim().toUpperCase();

  if (!trimmed) {
    return { success: false, message: "Enter a coupon code." };
  }

  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", trimmed)
    .maybeSingle();

  if (error || !coupon) {
    return { success: false, message: "Invalid coupon code." };
  }

  if (!coupon.is_active) {
    return { success: false, message: "This coupon is no longer active." };
  }

  const now = new Date();

  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { success: false, message: "This coupon isn't active yet." };
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return { success: false, message: "This coupon has expired." };
  }

  const minimumOrderAmount = Number(coupon.minimum_order_amount) || 0;

  if (subtotal < minimumOrderAmount) {
    return {
      success: false,
      message: `Minimum order value for this coupon is ₹${minimumOrderAmount.toLocaleString(
        "en-IN"
      )}.`,
    };
  }

  if (
    coupon.usage_limit !== null &&
    coupon.usage_count >= coupon.usage_limit
  ) {
    return {
      success: false,
      message: "This coupon has reached its usage limit.",
    };
  }

  if (profileId && coupon.per_customer_limit) {
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profileId)
      .eq("coupon_id", coupon.id);

    if ((count ?? 0) >= coupon.per_customer_limit) {
      return {
        success: false,
        message:
          "You've already used this coupon the maximum number of times.",
      };
    }
  }

  let discountAmount =
    coupon.discount_type === "percentage"
      ? (subtotal * Number(coupon.discount_value)) / 100
      : Number(coupon.discount_value);

  if (
    coupon.maximum_discount_amount !== null &&
    discountAmount > Number(coupon.maximum_discount_amount)
  ) {
    discountAmount = Number(coupon.maximum_discount_amount);
  }

  discountAmount = Math.round(
    Math.max(0, Math.min(discountAmount, subtotal))
  );

  return { success: true, coupon: coupon as Coupon, discountAmount };
}
