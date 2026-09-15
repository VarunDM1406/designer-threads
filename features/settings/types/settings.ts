export interface StoreSettings {
  store_name: string;
  store_email: string;
  store_phone: string;
  whatsapp_number: string;
  store_description: string;
  store_address: string;
  instagram_url: string;
  website_url: string;
  shipping_charge: number;
  free_shipping_above: number;
  minimum_order_value: number;
  tax_percent: number;
  admin_name: string;
  admin_email: string;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  store_name: "Designer Threads",
  store_email: "",
  store_phone: "",
  whatsapp_number: "",
  store_description: "",
  store_address: "",
  instagram_url: "",
  website_url: "",
  shipping_charge: 0,
  free_shipping_above: 0,
  minimum_order_value: 0,
  tax_percent: 0,
  admin_name: "",
  admin_email: "",
};
