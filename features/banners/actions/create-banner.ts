"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CreateBannerInput = {
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;

  image_url: string | null;
  mobile_image_url: string | null;
  background_color: string | null;

  position:
    | "hero"
    | "announcement"
    | "collection"
    | "promotion";

  display_order: number;

  starts_at: string | null;
  ends_at: string | null;

  is_active: boolean;
};

export async function createBanner(
  input: CreateBannerInput
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .insert({
      title: input.title?.trim() || null,
      subtitle: input.subtitle?.trim() || null,

      button_text:
        input.button_text?.trim() || null,

      button_link:
        input.button_link?.trim() || null,

      image_url: input.image_url?.trim() || null,

      mobile_image_url:
        input.mobile_image_url?.trim() || null,

      background_color:
        input.background_color?.trim() || null,

      position: input.position,

      display_order: input.display_order,

      starts_at: input.starts_at,
      ends_at: input.ends_at,

      is_active: input.is_active,
    })
    .select()
    .single();

  if (error) {
    console.error("CREATE BANNER ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  revalidatePath("/collections");

  return data;
}