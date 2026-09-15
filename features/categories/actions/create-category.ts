"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  categorySchema,
  type CategorySchema,
} from "../schemas/category.schema";

export async function createCategory(
  values: CategorySchema
) {
  const parsed = categorySchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .insert(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/categories");

  return {
    success: true,
    message: "Category created successfully.",
  };
}