import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/features/products/actions/get-products";
import { getCategoryOptions } from "@/features/categories/actions/get-category-options";
import { getCollections } from "@/features/collections/actions/get-collections";
import ShopCatalog from "@/features/shop/components/shop-catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Discover thoughtfully crafted Indian wear, designed around traditional artistry and contemporary silhouettes.",
  alternates: {
    canonical: "/shop",
  },
};

export default async function ShopPage() {
  const [products, categories, collections] = await Promise.all([
    getProducts(),
    getCategoryOptions(),
    getCollections(),
  ]);

  const activeCollections = collections.filter(
    (collection) => collection.is_active !== false
  );

  return (
    <>
      <Navbar />

      {/* Reserve space for fixed two-tier navbar */}
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white">
        {/* SHOP HEADER */}
        <section className="border-b border-[#ddd6ca] bg-white px-5 py-10 sm:px-8 md:py-14 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            {/* BREADCRUMB */}
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
              <Link href="/" className="transition-colors hover:text-[#103f35]">
                Home
              </Link>

              <ChevronRight size={12} strokeWidth={1.5} />

              <span className="text-[#103f35]">Shop</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Shop
            </h1>

            <p className="mt-4 max-w-[560px] font-sans text-[13px] leading-6 text-[#60716e] sm:text-[14px]">
              Discover thoughtfully crafted Indian wear, designed around
              traditional artistry and contemporary silhouettes.
            </p>
          </div>
        </section>

        <Suspense fallback={<ShopCatalogSkeleton />}>
          <ShopCatalog
            products={products}
            categories={categories}
            collections={activeCollections}
          />
        </Suspense>

        <Footer />
      </main>
    </>
  );
}

function ShopCatalogSkeleton() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 md:py-12 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1680px]">
        <div className="h-[52px] animate-pulse border-b border-[#ddd6ca]" />

        <div className="flex gap-10 pt-8 xl:gap-14">
          <div className="hidden w-[220px] shrink-0 space-y-4 lg:block">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-4 w-3/4 animate-pulse rounded-full bg-[#103f35]/10" />
            ))}
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] w-full rounded-[2px] bg-[#103f35]/10" />
                <div className="mt-3 h-3 w-3/4 rounded-full bg-[#103f35]/10" />
                <div className="mt-2 h-3 w-1/3 rounded-full bg-[#103f35]/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
