"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteProductImage(
  imageId: string
) {
  const supabase = await createClient();

  const { data: image, error: fetchError } = await supabase
    .from("product_images")
    .select("image_url")
    .eq("id", imageId)
    .single();

  if (fetchError || !image) {
    return {
      success: false,
      message: "Image not found.",
    };
  }

  const path = image.image_url.split("/products/")[1];

  if (path) {
    await supabase.storage
      .from("products")
      .remove([path]);
  }

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
}