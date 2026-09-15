"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCollections() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getCollection(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getCollectionBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}