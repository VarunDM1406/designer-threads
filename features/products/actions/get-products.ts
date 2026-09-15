"use server";

import { createClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "*, product_images(id, image_url, is_primary, display_order), categories(id, name, slug), product_collections(collection_id)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getProductsByCollection(collectionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "*, product_images(id, image_url, is_primary, display_order), categories(id, name, slug), product_collections!inner(collection_id)"
    )
    .eq("product_collections.collection_id", collectionId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeProductId: string
) {
  const supabase = await createClient();

  if (categoryId) {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, slug, price, compare_at_price, stock_quantity, product_images(id, image_url, is_primary, display_order)"
      )
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .neq("id", excludeProductId)
      .limit(4);

    if (error) {
      console.error(error);
    } else if (data && data.length > 0) {
      return data;
    }
  }

  // No products in the same category (or no category at all) —
  // fall back to other active products so the section isn't empty.
  return getSuggestedProducts([excludeProductId], 4);
}

export async function getSuggestedProducts(
  excludeIds: string[] = [],
  limit = 4
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, compare_at_price, stock_quantity, product_images(id, image_url, is_primary, display_order)"
    )
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit + excludeIds.length);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? [])
    .filter((product) => !excludeIds.includes(product.id))
    .slice(0, limit);
}

export async function getProduct(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  return data;
}