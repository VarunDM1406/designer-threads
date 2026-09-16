import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticRoutes: MetadataRoute.Sitemap = ([
  { url: "/", changeFrequency: "daily", priority: 1 },
  { url: "/shop", changeFrequency: "daily", priority: 0.9 },
  { url: "/collections", changeFrequency: "daily", priority: 0.8 },
  { url: "/about", changeFrequency: "monthly", priority: 0.5 },
  { url: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { url: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { url: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { url: "/shipping", changeFrequency: "yearly", priority: 0.2 },
  { url: "/returns", changeFrequency: "yearly", priority: 0.2 },
] as const).map((route) => ({
  ...route,
  url: `${siteUrl}${route.url}`,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: products }, { data: collections }] = await Promise.all([
    supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true),
    supabase
      .from("collections")
      .select("slug, updated_at")
      .eq("is_active", true),
  ]);

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map(
    (product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.updated_at ?? undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const collectionRoutes: MetadataRoute.Sitemap = (collections ?? []).map(
    (collection) => ({
      url: `${siteUrl}/collections/${collection.slug}`,
      lastModified: collection.updated_at ?? undefined,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  );

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
