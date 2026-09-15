"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProductImages(
  productId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("display_order", {
      ascending: true,
    });

  if (error) {
    return [];
  }

  return data;
}