"use client";

import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";

import ProductCard from "@/features/products/components/product-card";

type ProductImage = {
  id?: string;
  image_url: string;
  alt_text?: string | null;
  is_primary?: boolean | null;
  display_order?: number | null;
};

type ShopProduct = {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  price: number | string;
  compare_at_price?: number | string | null;
  short_description?: string | null;
  description?: string | null;
  category_id?: string | null;
  categories?: { id: string; name: string; slug?: string } | null;
  product_collections?: { collection_id: string }[] | null;
  is_active?: boolean | null;
  is_new_arrival?: boolean | null;
  is_best_seller?: boolean | null;
  is_featured?: boolean | null;
  stock_quantity?: number | null;
  created_at?: string;
  product_images?: ProductImage[];
};

type CategoryOption = { id: string; name: string };
type CollectionOption = { id: string; name: string; slug?: string };

type Highlight = "all" | "new" | "bestseller" | "featured";

const highlightOptions: { value: Highlight; label: string }[] = [
  { value: "all", label: "All Pieces" },
  { value: "new", label: "New Arrivals" },
  { value: "bestseller", label: "Best Sellers" },
  { value: "featured", label: "Featured" },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

type ShopCatalogProps = {
  products: ShopProduct[];
  categories: CategoryOption[];
  collections: CollectionOption[];
};

export default function ShopCatalog({
  products,
  categories,
  collections,
}: ShopCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    () => searchParams.get("q") ?? ""
  );
  const [sort, setSort] = useState(
    () => searchParams.get("sort") ?? "featured"
  );
  const [highlight, setHighlight] = useState<Highlight>(
    () => (searchParams.get("filter") as Highlight) || "all"
  );
  const [categoryId, setCategoryId] = useState(
    () => searchParams.get("category") ?? "all"
  );
  const [collectionId, setCollectionId] = useState(
    () => searchParams.get("collection") ?? "all"
  );
  const [inStockOnly, setInStockOnly] = useState(
    () => searchParams.get("stock") === "1"
  );
  const [minPrice, setMinPrice] = useState(
    () => searchParams.get("min") ?? ""
  );
  const [maxPrice, setMaxPrice] = useState(
    () => searchParams.get("max") ?? ""
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const lastSyncedRef = useRef(searchParams.toString());

  // Adopt filter changes that came from outside this component
  // (e.g. a Footer "New Arrivals" link clicked while already on /shop).
  useEffect(() => {
    const current = searchParams.toString();

    if (current === lastSyncedRef.current) return;

    setSearch(searchParams.get("q") ?? "");
    setSort(searchParams.get("sort") ?? "featured");
    setHighlight((searchParams.get("filter") as Highlight) || "all");
    setCategoryId(searchParams.get("category") ?? "all");
    setCollectionId(searchParams.get("collection") ?? "all");
    setInStockOnly(searchParams.get("stock") === "1");
    setMinPrice(searchParams.get("min") ?? "");
    setMaxPrice(searchParams.get("max") ?? "");

    lastSyncedRef.current = current;
  }, [searchParams]);

  // Push local filter state into the URL so results are shareable/bookmarkable.
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();

      if (search.trim()) params.set("q", search.trim());
      if (sort !== "featured") params.set("sort", sort);
      if (highlight !== "all") params.set("filter", highlight);
      if (categoryId !== "all") params.set("category", categoryId);
      if (collectionId !== "all") params.set("collection", collectionId);
      if (inStockOnly) params.set("stock", "1");
      if (minPrice) params.set("min", minPrice);
      if (maxPrice) params.set("max", maxPrice);

      const qs = params.toString();

      lastSyncedRef.current = qs;
      router.replace(qs ? `${pathname}?${qs}` : pathname, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    search,
    sort,
    highlight,
    categoryId,
    collectionId,
    inStockOnly,
    minPrice,
    maxPrice,
    pathname,
    router,
  ]);

  const activeProducts = useMemo(
    () => products.filter((product) => product.is_active !== false),
    [products]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const product of activeProducts) {
      if (!product.category_id) continue;
      counts[product.category_id] = (counts[product.category_id] ?? 0) + 1;
    }

    return counts;
  }, [activeProducts]);

  const collectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const product of activeProducts) {
      for (const link of product.product_collections ?? []) {
        counts[link.collection_id] = (counts[link.collection_id] ?? 0) + 1;
      }
    }

    return counts;
  }, [activeProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...activeProducts];

    if (highlight === "new") {
      result = result.filter((product) => product.is_new_arrival);
    }

    if (highlight === "bestseller") {
      result = result.filter((product) => product.is_best_seller);
    }

    if (highlight === "featured") {
      result = result.filter((product) => product.is_featured);
    }

    if (categoryId !== "all") {
      result = result.filter(
        (product) => product.category_id === categoryId
      );
    }

    if (collectionId !== "all") {
      result = result.filter((product) =>
        product.product_collections?.some(
          (link) => link.collection_id === collectionId
        )
      );
    }

    if (inStockOnly) {
      result = result.filter(
        (product) =>
          product.stock_quantity == null || product.stock_quantity > 0
      );
    }

    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    if (min !== null && !Number.isNaN(min)) {
      result = result.filter((product) => Number(product.price) >= min);
    }

    if (max !== null && !Number.isNaN(max)) {
      result = result.filter((product) => Number(product.price) <= max);
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((product) => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query) ||
          product.short_description?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.categories?.name?.toLowerCase().includes(query)
        );
      });
    }

    if (sort === "featured") {
      result.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() -
          new Date(a.created_at ?? 0).getTime()
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sort === "name") {
      result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }

    return result;
  }, [
    activeProducts,
    highlight,
    categoryId,
    collectionId,
    inStockOnly,
    minPrice,
    maxPrice,
    search,
    sort,
  ]);

  const activeFilterCount =
    (highlight !== "all" ? 1 : 0) +
    (categoryId !== "all" ? 1 : 0) +
    (collectionId !== "all" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0 || Boolean(search.trim());

  function clearFilters() {
    setSearch("");
    setHighlight("all");
    setCategoryId("all");
    setCollectionId("all");
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
  }

  // Lock background scroll while the mobile filter drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  const filterContent = (
    <>
      <FilterSection title="Show">
        {highlightOptions.map((option) => (
          <FilterOption
            key={option.value}
            active={highlight === option.value}
            onClick={() => setHighlight(option.value)}
          >
            {option.label}
          </FilterOption>
        ))}
      </FilterSection>

      {categories.length > 0 && (
        <FilterSection title="Category">
          <FilterOption
            active={categoryId === "all"}
            onClick={() => setCategoryId("all")}
          >
            All Categories
          </FilterOption>

          {categories.map((category) => (
            <FilterOption
              key={category.id}
              active={categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            >
              {category.name}
              {categoryCounts[category.id] ? (
                <span className="text-[#a8a29e]">
                  {" "}
                  ({categoryCounts[category.id]})
                </span>
              ) : null}
            </FilterOption>
          ))}
        </FilterSection>
      )}

      {collections.length > 0 && (
        <FilterSection title="Collection">
          <FilterOption
            active={collectionId === "all"}
            onClick={() => setCollectionId("all")}
          >
            All Collections
          </FilterOption>

          {collections.map((collection) => (
            <FilterOption
              key={collection.id}
              active={collectionId === collection.id}
              onClick={() => setCollectionId(collection.id)}
            >
              {collection.name}
              {collectionCounts[collection.id] ? (
                <span className="text-[#a8a29e]">
                  {" "}
                  ({collectionCounts[collection.id]})
                </span>
              ) : null}
            </FilterOption>
          ))}
        </FilterSection>
      )}

      <FilterSection title="Availability">
        <label className="flex items-center gap-3 py-1.5 text-[13px] text-[#171717]">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="h-4 w-4 accent-[#103f35]"
          />
          In stock only
        </label>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#60716e]">
              ₹
            </span>

            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="Min"
              className="h-10 w-full border border-[#ddd6ca] bg-white pl-7 pr-3 text-[12px] text-[#103f35] outline-none focus:border-[#103f35]/40"
            />
          </div>

          <span className="text-[#60716e]">—</span>

          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#60716e]">
              ₹
            </span>

            <input
              type="number"
              min={0}
              inputMode="numeric"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max"
              className="h-10 w-full border border-[#ddd6ca] bg-white pl-7 pr-3 text-[12px] text-[#103f35] outline-none focus:border-[#103f35]/40"
            />
          </div>
        </div>
      </FilterSection>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="text-[10px] uppercase tracking-[0.16em] text-[#103f35] underline underline-offset-4"
        >
          Clear all filters
        </button>
      )}
    </>
  );

  return (
    <section className="bg-white px-5 pt-10 pb-24 sm:px-8 md:pt-12 md:pb-28 lg:px-12 lg:pb-32 xl:px-16">
      <div className="mx-auto max-w-[1680px]">
        {/* TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd6ca] pb-5">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[#103f35] lg:hidden"
            >
              <SlidersHorizontal size={15} strokeWidth={1.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#103f35] px-1 text-[9px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <p className="text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative hidden min-w-0 sm:block">
              <Search
                size={14}
                strokeWidth={1.5}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#60716e]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search pieces"
                className="h-9 w-[190px] border-b border-[#ddd6ca] bg-transparent pl-[22px] pr-7 text-[12px] text-[#171717] outline-none placeholder:text-[#60716e]/70 focus:border-[#103f35]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-[#60716e]"
                >
                  <X size={12} strokeWidth={1.5} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileSearchOpen((current) => !current)}
              aria-label="Search"
              className="sm:hidden"
            >
              <Search size={16} strokeWidth={1.5} className="text-[#103f35]" />
            </button>

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
          </div>
        </div>

        {/* mobile search field */}
        {mobileSearchOpen && (
          <div className="relative mt-4 sm:hidden">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-[#60716e]"
            />

            <input
              autoFocus
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pieces"
              className="h-9 w-full border-b border-[#ddd6ca] bg-transparent pl-[22px] pr-7 text-[12px] text-[#171717] outline-none placeholder:text-[#60716e]/70 focus:border-[#103f35]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-[#60716e]"
              >
                <X size={12} strokeWidth={1.5} />
              </button>
            )}
          </div>
        )}

        <div className="flex gap-10 pt-8 xl:gap-14">
          {/* SIDEBAR — persistent on desktop */}
          <aside className="hidden w-[220px] shrink-0 lg:block">
            <div className="space-y-8">{filterContent}</div>
          </aside>

          {/* MAIN */}
          <div className="min-w-0 flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
                  Nothing found
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
                  No pieces found.
                </h2>

                <p className="mt-2 text-[13px] text-[#60716e]">
                  Try adjusting your filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35]"
                >
                  View all pieces
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 z-[70] flex w-full max-w-[340px] flex-col bg-white shadow-2xl lg:hidden">
            <div className="flex items-center justify-between border-b border-[#ddd6ca] px-6 py-5">
              <h2 className="font-serif text-xl tracking-[-0.02em] text-[#103f35]">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} strokeWidth={1.5} className="text-[#103f35]" />
              </button>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              {filterContent}
            </div>

            <div className="border-t border-[#ddd6ca] px-6 py-5">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-[#103f35] py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
              >
                Show {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "piece" : "pieces"}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[9px] font-medium uppercase tracking-[0.24em] text-[#a87932]">
        {title}
      </h3>

      <div className="mt-3 space-y-0.5">{children}</div>
    </div>
  );
}

function FilterOption({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between py-1.5 text-left text-[13px] transition-colors ${
        active ? "font-medium text-[#103f35]" : "text-[#60716e] hover:text-[#103f35]"
      }`}
    >
      <span>{children}</span>

      {active && (
        <Check size={14} strokeWidth={2} className="shrink-0 text-[#103f35]" />
      )}
    </button>
  );
}
