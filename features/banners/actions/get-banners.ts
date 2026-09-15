"use server";

import { createClient } from "@/lib/supabase/server";
import type { Banner, BannerPosition } from "../types/banner";

export async function getActiveBanners(
  position: BannerPosition
): Promise<Banner[]> {
  const supabase = await createClient();

  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("position", position)
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET ACTIVE BANNERS ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return [];
  }

  return (data ?? []) as Banner[];
}

export async function getBanners(): Promise<Banner[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET BANNERS ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    return [];
  }

  return (data ?? []) as Banner[];
}