"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StoreSettings } from "../types/settings";

export async function updateSettings(values: StoreSettings) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("store_settings")
    .upsert({ id: 1, ...values, updated_at: new Date().toISOString() });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/settings");

  return {
    success: true,
    message: "Settings saved successfully.",
  };
}
