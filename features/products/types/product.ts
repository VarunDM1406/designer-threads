export type ProductStatus = "draft" | "active" | "archived";

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  cost_price: number | null;
  inventory_quantity: number;
  is_default: boolean;
}

export interface Product {
  id: string;

  name: string;

  slug: string;

  short_description: string | null;

  description: string | null;

  status: ProductStatus;

  featured: boolean;

  created_at: string;

  updated_at: string;

  images: ProductImage[];

  variants: ProductVariant[];
}