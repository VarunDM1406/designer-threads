"use client";

import { useEffect, useState } from "react";

import { getSuggestedProducts } from "@/features/products/actions/get-products";
import ProductCard from "@/features/products/components/product-card";
import type { CartItem } from "../types/cart";

const STORAGE_KEY = "designer-threads-cart";

type SuggestedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  compare_at_price?: number | string | null;
  stock_quantity?: number | null;
  product_images?: {
    id?: string;
    image_url: string;
    alt_text?: string | null;
    is_primary?: boolean | null;
    display_order?: number | null;
  }[];
};

export default function CartRecommendations() {
  const [products, setProducts] = useState<SuggestedProduct[]>([]);

  useEffect(() => {
    // Read localStorage directly (rather than the cart context's `items`)
    // so this always sees the real persisted cart on the very first read,
    // regardless of whether CartProvider has finished its own hydration
    // effect yet. This list is fetched once and deliberately doesn't
    // refetch as items are added, so a recommended product stays in place
    // (now showing its cart quantity) instead of vanishing and reshuffling
    // the grid.
    let excludeIds: string[] = [];

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        excludeIds = (JSON.parse(saved) as CartItem[]).map(
          (item) => item.productId
        );
      }
    } catch {
      // ignore malformed/missing cart data
    }

    getSuggestedProducts(excludeIds, 4).then((data) => {
      setProducts(data as SuggestedProduct[]);
    });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-[#ddd6ca] pt-14">
      <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
        You May Also Like
      </p>

      <h2 className="mt-3 font-serif text-2xl tracking-[-0.02em] text-[#103f35] sm:text-3xl">
        Complete the Look
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
