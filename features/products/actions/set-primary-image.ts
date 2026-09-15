"use server";

import { createClient } from "@/lib/supabase/server";

export async function setPrimaryImage(
  productId: string,
  imageId: string
) {
  const supabase = await createClient();

  const { error: resetError } = await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);

  if (resetError) {
    return {
      success: false,
      message: resetError.message,
    };
  }

  const { error } = await supabase
    .from("product_images")
    .update({ is_primary: true })
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