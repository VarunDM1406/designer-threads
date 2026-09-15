"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  collectionSchema,
  type CollectionSchema,
} from "../schemas/collection.schema";

export async function updateCollection(
  id: string,
  values: CollectionSchema
) {
  const parsed = collectionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("collections")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/admin/collections");

  return {
    success: true,
    message: "Collection updated successfully.",
  };
}