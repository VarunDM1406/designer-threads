"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteBanner(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("DELETE BANNER ERROR:", {
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

  return { success: true };
}