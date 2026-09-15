import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchResults from "@/features/search/components/search-results";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Designer Threads for pieces by name, category, or SKU.",
};

export default function SearchPage() {
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

              <span className="text-[#103f35]">Search</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Search
            </h1>
          </div>
        </section>

        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}

function SearchResultsSkeleton() {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 md:py-12 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1680px]">
        <div className="mx-auto h-12 max-w-[560px] animate-pulse border-b border-[#ddd6ca]" />

        <div className="mt-16 flex min-h-[200px] items-center justify-center">
          <div className="h-3 w-40 animate-pulse rounded-full bg-[#103f35]/10" />
        </div>
      </div>
    </section>
  );
}
