import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required").max(100),

  slug: z.string().min(2, "Slug is required").max(100),

  description: z.string().optional(),

  image_url: z.string().optional(),

  is_active: z.boolean(),
});

export type CategorySchema = z.input<typeof categorySchema>;