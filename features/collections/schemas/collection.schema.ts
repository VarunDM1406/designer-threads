import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string().min(2, "Name is required"),

  slug: z.string().min(2, "Slug is required"),

  description: z.string().optional(),

  banner_image_url: z.string().optional(),

  thumbnail_image_url: z.string().optional(),

  is_featured: z.boolean(),

  is_active: z.boolean(),
});

export type CollectionSchema = z.input<typeof collectionSchema>;