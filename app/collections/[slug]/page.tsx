import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCollectionBySlug } from "@/features/collections/actions/get-collections";
import { getProductsByCollection } from "@/features/products/actions/get-products";
import ProductCard from "@/features/products/components/product-card";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return { title: "Collection" };
  }

  return {
    title: collection.name,
    description:
      collection.description ??
      `Explore the ${collection.name} collection from Designer Threads.`,
  };
}

export default async function CollectionDetailPage({
  params,
}: Props) {
  const { slug } = await params;

  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await getProductsByCollection(collection.id);

  const heroImage =
    collection.banner_image_url || collection.thumbnail_image_url || null;

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#e8e2d7]">
          <div className="relative min-h-[280px] w-full sm:min-h-[360px] md:min-h-[420px]">
            {heroImage ? (
              <>
                <img
                  src={heroImage}
                  alt={collection.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#ded7ca] via-[#eee9df] to-[#d3cabc]" />
            )}

            <div className="relative flex h-full min-h-[280px] flex-col justify-end px-5 py-10 sm:min-h-[360px] sm:px-8 md:min-h-[420px] lg:px-12 xl:px-16">
              <div className="mx-auto w-full max-w-[1680px]">
                <div
                  className={`flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] ${
                    heroImage ? "text-white/70" : "text-[#60716e]"
                  }`}
                >
                  <Link
                    href="/"
                    className="transition-colors hover:opacity-70"
                  >
                    Home
                  </Link>

                  <ChevronRight size={12} strokeWidth={1.5} />

                  <Link
                    href="/collections"
                    className="transition-colors hover:opacity-70"
                  >
                    Collections
                  </Link>

                  <ChevronRight size={12} strokeWidth={1.5} />

                  <span
                    className={heroImage ? "text-white" : "text-[#103f35]"}
                  >
                    {collection.name}
                  </span>
                </div>

                <h1
                  className={`mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] sm:text-[3.4rem] ${
                    heroImage ? "text-white" : "text-[#103f35]"
                  }`}
                >
                  {collection.name}
                </h1>

                {collection.description && (
                  <p
                    className={`mt-4 max-w-[560px] text-[13px] leading-6 sm:text-[14px] ${
                      heroImage ? "text-white/85" : "text-[#60716e]"
                    }`}
                  >
                    {collection.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="px-5 py-14 sm:px-8 md:py-16 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            {products.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
                  Coming Soon
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
                  Pieces from this edit are on their way.
                </h2>

                <p className="mt-2 text-[13px] text-[#60716e]">
                  Check back shortly, or explore the full shop in the meantime.
                </p>

                <Link
                  href="/shop"
                  className="mt-6 border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35]"
                >
                  Explore the Shop
                </Link>
              </div>
            ) : (
              <>
                <p className="mb-8 text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
                  {products.length}{" "}
                  {products.length === 1 ? "piece" : "pieces"}
                </p>

                <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 2xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
