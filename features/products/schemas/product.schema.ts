import { z } from "zod";

export const productSchema = z.object({
  // Basic
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  sku: z.string().min(2, "SKU is required"),

// Organization
category_id: z.string().uuid(),
collections: z.array(z.string().uuid()).default([]),
  // Pricing
  price: z.coerce.number().min(0),
  compare_at_price: z.coerce.number().nullable().optional(),

  // Inventory
  stock_quantity: z.coerce.number().min(0),

  // Description
  short_description: z.string().optional(),
  description: z.string().optional(),
  fabric: z.string().optional(),
  care_instructions: z.string().optional(),

  // Visibility
  featured: z.boolean(),
  new_arrival: z.boolean(),
  best_seller: z.boolean(),
  is_active: z.boolean(),

  // SEO
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export type ProductSchema = z.input<typeof productSchema>;