"use server";

import { createClient } from "@/lib/supabase/server";
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from "../types/settings";

export async function getSettings(): Promise<StoreSettings> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    return DEFAULT_STORE_SETTINGS;
  }

  return {
    store_name: data.store_name ?? DEFAULT_STORE_SETTINGS.store_name,
    store_email: data.store_email ?? "",
    store_phone: data.store_phone ?? "",
    whatsapp_number: data.whatsapp_number ?? "",
    store_description: data.store_description ?? "",
    store_address: data.store_address ?? "",
    instagram_url: data.instagram_url ?? "",
    website_url: data.website_url ?? "",
    shipping_charge: Number(data.shipping_charge) || 0,
    free_shipping_above: Number(data.free_shipping_above) || 0,
    minimum_order_value: Number(data.minimum_order_value) || 0,
    tax_percent: Number(data.tax_percent) || 0,
    admin_name: data.admin_name ?? "",
    admin_email: data.admin_email ?? "",
  };
}
