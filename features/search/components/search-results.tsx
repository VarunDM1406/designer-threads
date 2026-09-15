"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import ProductCard from "@/features/products/components/product-card";
import { searchProducts } from "../actions/search-products";

type ProductImage = {
  id?: string;
  image_url: string;
  alt_text?: string | null;
  is_primary?: boolean | null;
  display_order?: number | null;
};

type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  short_description?: string | null;
  description?: string | null;
  categories?:
    | { id: string; name: string; slug?: string }
    | { id: string; name: string; slug?: string }[]
    | null;
  is_active?: boolean | null;
  is_new_arrival?: boolean | null;
  is_best_seller?: boolean | null;
  is_featured?: boolean | null;
  stock_quantity?: number | null;
  created_at?: string;
  product_images?: ProductImage[];
};

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

export default function SearchResults() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(
    () => searchParams.get("q") ?? ""
  );
  const [sort, setSort] = useState(
    () => searchParams.get("sort") ?? "relevance"
  );

  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const lastSyncedRef = useRef(searchParams.toString());
  const requestIdRef = useRef(0);

  // Adopt query changes that came from outside this component
  // (e.g. searching again from the Navbar while already on /search).
  useEffect(() => {
    const current = searchParams.toString();

    if (current === lastSyncedRef.current) return;

    setQuery(searchParams.get("q") ?? "");
    setSort(searchParams.get("sort") ?? "relevance");

    lastSyncedRef.current = current;
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();

      if (query.trim()) params.set("q", query.trim());
      if (sort !== "relevance") params.set("sort", sort);

      const qs = params.toString();

      lastSyncedRef.current = qs;
      router.replace(qs ? `${pathname}?${qs}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, sort, pathname, router]);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);

    const timeout = setTimeout(async () => {
      const data = await searchProducts(trimmed);

      if (requestId === requestIdRef.current) {
        setResults(data as SearchProduct[]);
        setSearched(true);
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const sortedResults = useMemo(() => {
    const matches = [...results];

    if (sort === "newest") {
      matches.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
    }

    if (sort === "price-low") {
      matches.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
      matches.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "name") {
      matches.sort((a, b) =>
        String(a.name).localeCompare(String(b.name))
      );
    }

    return matches;
  }, [results, sort]);

  const hasQuery = Boolean(query.trim());

  return (
    <section className="bg-white px-5 py-10 pb-24 sm:px-8 md:py-12 md:pb-28 lg:px-12 lg:pb-32 xl:px-16">
      <div className="mx-auto max-w-[1680px]">
        {/* SEARCH INPUT */}
        <div className="relative mx-auto max-w-[560px]">
          <Search
            size={18}
            strokeWidth={1.5}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-[#60716e]"
          />

          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, category, or SKU"
            className="h-12 w-full border-b border-[#ddd6ca] bg-transparent pl-8 pr-8 text-[16px] text-[#171717] outline-none placeholder:text-[#60716e]/70 focus:border-[#103f35]"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* RESULTS TOOLBAR */}
        {hasQuery && !loading && (
          <div className="mt-10 flex items-center justify-between border-b border-[#ddd6ca] pb-5">
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
              {sortedResults.length}{" "}
              {sortedResults.length === 1 ? "result" : "results"}
              {" "}for &ldquo;{query.trim()}&rdquo;
            </p>

            {sortedResults.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="hidden text-[9px] uppercase tracking-[0.16em] text-[#60716e] sm:inline">
                  Sort By
                </span>

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="cursor-pointer border-none bg-transparent text-[11px] font-medium uppercase tracking-[0.08em] text-[#103f35] outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* RESULTS / EMPTY STATE */}
        {!hasQuery ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center pt-10 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Start typing
            </p>

            <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              What are you looking for?
            </h2>

            <p className="mt-2 text-[13px] text-[#60716e]">
              Search by piece name, category, or SKU.
            </p>
          </div>
        ) : loading ? (
          <div className="flex min-h-[300px] items-center justify-center pt-10">
            <div className="h-3 w-40 animate-pulse rounded-full bg-[#103f35]/10" />
          </div>
        ) : searched && sortedResults.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center pt-10 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Nothing Found
            </p>

            <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              No pieces found.
            </h2>

            <p className="mt-2 text-[13px] text-[#60716e]">
              Try a different search, or explore the full shop.
            </p>

            <a
              href="/shop"
              className="mt-6 border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35]"
            >
              Explore the Shop
            </a>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 2xl:grid-cols-4">
            {sortedResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
