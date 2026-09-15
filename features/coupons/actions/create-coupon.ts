"use server";

import { createClient } from "@/lib/supabase/server";

type CreateCouponInput = {
  code: string;
  name: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  minimum_order_amount?: number;
  maximum_discount_amount?: number | null;
  usage_limit?: number | null;
  per_customer_limit?: number;
  starts_at?: string | null;
  expires_at?: string | null;
};

export async function createCoupon(input: CreateCouponInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description?.trim() || null,

      discount_type: input.discount_type,
      discount_value: input.discount_value,

      minimum_order_amount:
        input.minimum_order_amount ?? 0,

      maximum_discount_amount:
        input.maximum_discount_amount ?? null,

      usage_limit:
        input.usage_limit ?? null,

      usage_count: 0,

      per_customer_limit:
        input.per_customer_limit ?? 1,

      starts_at:
        input.starts_at ?? null,

      expires_at:
        input.expires_at ?? null,

      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE COUPON ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message);
  }

  return data;
}