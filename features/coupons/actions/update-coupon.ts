"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateCouponInput = {
  id: string;

  code: string;
  name: string;
  description: string | null;

  discount_type: "percentage" | "fixed";
  discount_value: number;

  minimum_order_amount: number;
  maximum_discount_amount: number | null;

  usage_limit: number | null;
  per_customer_limit: number;

  starts_at: string | null;
  expires_at: string | null;

  is_active: boolean;
};

export async function updateCoupon(input: UpdateCouponInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("coupons")
    .update({
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      description: input.description?.trim() || null,

      discount_type: input.discount_type,
      discount_value: input.discount_value,

      minimum_order_amount: input.minimum_order_amount,
      maximum_discount_amount: input.maximum_discount_amount,

      usage_limit: input.usage_limit,
      per_customer_limit: input.per_customer_limit,

      starts_at: input.starts_at,
      expires_at: input.expires_at,

      is_active: input.is_active,

      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id);

  if (error) {
    console.error("UPDATE COUPON ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message);
  }

  revalidatePath("/admin/coupons");
  revalidatePath(`/admin/coupons/${input.id}`);
  revalidatePath(`/admin/coupons/${input.id}/edit`);

  return { success: true };
}