import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCollections } from "@/features/collections/actions/get-collections";
import CollectionCard from "@/features/collections/components/collection-card";
import { getActiveBanners } from "@/features/banners/actions/get-banners";
import PromotionBanner from "@/features/banners/components/promotion-banner";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Curated edits of Designer Threads' finest pieces, organized by occasion and style.",
  alternates: {
    canonical: "/collections",
  },
};

export default async function CollectionsPage() {
  const [collections, collectionBanners] = await Promise.all([
    getCollections(),
    getActiveBanners("collection"),
  ]);

  const active = collections.filter(
    (collection) => collection.is_active !== false
  );

  const featured = active.find((collection) => collection.is_featured);
  const rest = active.filter(
    (collection) => collection.id !== featured?.id
  );

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white">
        {/* HEADER */}
        <section className="border-b border-[#ddd6ca] bg-white px-5 py-10 sm:px-8 md:py-14 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
              <Link href="/" className="transition-colors hover:text-[#103f35]">
                Home
              </Link>

              <ChevronRight size={12} strokeWidth={1.5} />

              <span className="text-[#103f35]">Collections</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Collections
            </h1>

            <p className="mt-4 max-w-[560px] font-sans text-[13px] leading-6 text-[#60716e] sm:text-[14px]">
              Curated edits of our finest pieces, organized by occasion,
              craft and style.
            </p>
          </div>
        </section>

        {collectionBanners[0] && (
          <PromotionBanner banner={collectionBanners[0]} />
        )}

        {active.length === 0 ? (
          <div className="mx-auto max-w-[1680px] px-5 py-24 text-center sm:px-8 lg:px-12 xl:px-16">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Coming Soon
            </p>

            <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              Collections coming soon.
            </h2>

            <p className="mt-2 text-[13px] text-[#60716e]">
              We&apos;re curating something special. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-[1680px] px-5 py-14 sm:px-8 md:py-16 lg:px-12 xl:px-16">
            {/* FEATURED */}
            {featured && (
              <div className="mb-14 md:mb-16">
                <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
                  Featured Edit
                </p>

                <CollectionCard
                  collection={featured}
                  aspect="aspect-[21/9]"
                />
              </div>
            )}

            {/* ALL COLLECTIONS */}
            {rest.length > 0 && (
              <>
                {featured && (
                  <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
                    All Collections
                  </p>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
                  {rest.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
