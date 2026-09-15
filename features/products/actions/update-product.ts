"use server";

import { createClient } from "@/lib/supabase/server";
import {
  productSchema,
  type ProductSchema,
} from "../schemas/product.schema";

export async function updateProduct(
  id: string,
  values: ProductSchema
) {
  const parsed = productSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid product data.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      sku: parsed.data.sku,

      category_id: parsed.data.category_id,

      short_description:
        parsed.data.short_description || null,

      description:
        parsed.data.description || null,

      fabric:
        parsed.data.fabric || null,

      care_instructions:
        parsed.data.care_instructions || null,

      price: parsed.data.price,

      compare_at_price:
        parsed.data.compare_at_price ?? null,

      stock_quantity:
        parsed.data.stock_quantity,

      is_featured:
        parsed.data.featured,

      is_new_arrival:
        parsed.data.new_arrival,

      is_best_seller:
        parsed.data.best_seller,

      is_active:
        parsed.data.is_active,

      seo_title:
        parsed.data.seo_title || null,

      seo_description:
        parsed.data.seo_description || null,
    })
    .eq("id", id);

 if (error) {
  console.error(error);

  return {
    success: false,
    message: error.message,
  };
}

// Remove existing collections
const { error: deleteError } = await supabase
  .from("product_collections")
  .delete()
  .eq("product_id", id);

if (deleteError) {
  return {
    success: false,
    message: deleteError.message,
  };
}

// Insert newly selected collections
if (parsed.data.collections.length > 0) {
  const { error: collectionsError } = await supabase
    .from("product_collections")
    .insert(
      parsed.data.collections.map((collectionId) => ({
        product_id: id,
        collection_id: collectionId,
      }))
    );

  if (collectionsError) {
    return {
      success: false,
      message: collectionsError.message,
    };
  }
}

return {
  success: true,
  message: "Product updated successfully.",
};
}