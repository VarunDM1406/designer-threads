"use server";

import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

type UploadBannerImageResult = {
  success: boolean;
  url?: string;
  message?: string;
};

export async function uploadBannerImage(
  formData: FormData
): Promise<UploadBannerImageResult> {
  const file = formData.get("file");
  const type = formData.get("type");

  if (!(file instanceof File)) {
    return {
      success: false,
      message: "No image provided.",
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      message: "Please upload an image file.",
    };
  }

  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      message: "Image must be smaller than 5MB.",
    };
  }

  if (type !== "desktop" && type !== "mobile") {
    return {
      success: false,
      message: "Invalid banner image type.",
    };
  }

  const supabase = await createClient();

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const fileName = `${type}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("banners")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("BANNER IMAGE UPLOAD ERROR:", uploadError);

    return {
      success: false,
      message: uploadError.message,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("banners")
    .getPublicUrl(fileName);

  return {
    success: true,
    url: publicUrl,
  };
}