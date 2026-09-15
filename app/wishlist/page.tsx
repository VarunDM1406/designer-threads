"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import WishlistItemCard from "@/features/wishlist/components/wishlist-item-card";

export default function WishlistPage() {
  const { items } = useWishlist();

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

              <span className="text-[#103f35]">Wishlist</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Your Wishlist
            </h1>

            <p className="mt-4 max-w-[560px] font-sans text-[13px] leading-6 text-[#60716e] sm:text-[14px]">
              {items.length > 0
                ? `${items.length} ${items.length === 1 ? "piece" : "pieces"} saved for later.`
                : "Pieces you save will appear here."}
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="px-5 py-14 sm:px-8 md:py-16 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            {items.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
                  Nothing Saved Yet
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
                  Your wishlist is waiting.
                </h2>

                <p className="mt-2 text-[13px] text-[#60716e]">
                  Save pieces you love and come back to them anytime.
                </p>

                <Link
                  href="/shop"
                  className="mt-6 border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35]"
                >
                  Explore the Shop
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 2xl:grid-cols-4">
                {items.map((item) => (
                  <WishlistItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
