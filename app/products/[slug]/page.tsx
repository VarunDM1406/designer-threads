import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/features/products/components/product-detail";
import RelatedProducts from "@/features/products/components/related-products";
import { getRelatedProducts } from "@/features/products/actions/get-products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "name, short_description, description, product_images(image_url, is_primary, display_order)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) {
    return { title: "Product" };
  }

  const description =
    product.short_description ||
    product.description?.slice(0, 160) ||
    `Shop ${product.name} at Designer Threads.`;

  const images = (product.product_images ?? [])
    .slice()
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      return (a.display_order ?? 0) - (b.display_order ?? 0);
    });

  const image = images[0]?.image_url;

  return {
    title: product.name,
    description,
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      sku,
      short_description,
      description,
      fabric,
      care_instructions,
      price,
      compare_at_price,
      stock_quantity,
      is_active,
      is_featured,
      is_new_arrival,
      is_best_seller,
      category_id,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        display_order
      ),
      product_variants (
        id,
        sku,
        size,
        color,
        price,
        stock_quantity,
        is_active
      )
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("PRODUCT DETAIL ERROR:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id
  );

  // Supabase infers a many-to-one embed's cardinality from the select
  // string alone, and defaults to an array when it can't tell — normalize
  // defensively since PostgREST returns a single object at runtime here.
  const category = Array.isArray(product.categories)
    ? product.categories[0]
    : product.categories;

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-10 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1400px]">
          {/* BREADCRUMB */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
            <Link href="/" className="transition-colors hover:text-[#103f35]">
              Home
            </Link>

            <ChevronRight size={12} strokeWidth={1.5} />

            <Link
              href="/shop"
              className="transition-colors hover:text-[#103f35]"
            >
              Shop
            </Link>

            {category && (
              <>
                <ChevronRight size={12} strokeWidth={1.5} />

                <Link
                  href={`/shop?category=${category.id}`}
                  className="transition-colors hover:text-[#103f35]"
                >
                  {category.name}
                </Link>
              </>
            )}

            <ChevronRight size={12} strokeWidth={1.5} />

            <span className="truncate text-[#103f35]">
              {product.name}
            </span>
          </div>

          <div className="mt-8">
            <ProductDetail product={product} />
          </div>

          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
