"use server";

import { createClient } from "@/lib/supabase/server";

export async function searchProducts(query: string) {
  const trimmed = query.trim();

  if (!trimmed) return [];

  const supabase = await createClient();

  const escaped = trimmed.replace(/[%_]/g, (char) => `\\${char}`);
  const pattern = `%${escaped}%`;

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, sku, price, compare_at_price, short_description, description, stock_quantity, is_active, is_new_arrival, is_best_seller, is_featured, created_at, product_images(id, image_url, alt_text, is_primary, display_order), categories(id, name, slug)"
    )
    .eq("is_active", true)
    .or(
      `name.ilike.${pattern},sku.ilike.${pattern},short_description.ilike.${pattern}`
    )
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
