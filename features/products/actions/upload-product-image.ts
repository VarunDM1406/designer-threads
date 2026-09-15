"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function uploadProductImage(formData: FormData) {
  const productId = formData.get("productId");
  const file = formData.get("file");

  if (typeof productId !== "string" || !productId) {
    return {
      success: false,
      message: "Missing product ID.",
    };
  }

  if (!(file instanceof File)) {
    return {
      success: false,
      message: "No file provided.",
    };
  }

  const supabase = await createClient();

  const extension = file.name.split(".").pop();
  const fileName = `${productId}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      message: uploadError.message,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("products").getPublicUrl(fileName);

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      image_url: publicUrl,
      display_order: 0,
      is_primary: false,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from("products").remove([fileName]);

    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    image: data,
  };
}