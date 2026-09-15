"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/features/cart/context/cart-context";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import type { WishlistItem } from "../types/wishlist";

type WishlistItemCardProps = {
  item: WishlistItem;
};

export default function WishlistItemCard({
  item,
}: WishlistItemCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const { removeItem } = useWishlist();

  const cartItem = items.find((cartItem) => cartItem.productId === item.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const hasDiscount =
    item.compareAtPrice != null && item.compareAtPrice > item.price;

  function handleAddToBag() {
    addItem({
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image ?? null,
    });
  }

  function handleIncrease() {
    if (!cartItem) return;
    updateQuantity(cartItem.id, cartItem.quantity + 1);
  }

  function handleDecrease() {
    if (!cartItem) return;
    updateQuantity(cartItem.id, cartItem.quantity - 1);
  }

  return (
    <article className="group min-w-0">
      <div className="relative">
        <Link href={`/products/${item.slug}`} className="block">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-[#efede7]">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                Image coming soon
              </div>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={() => removeItem(item.id)}
          aria-label="Remove from wishlist"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 transition-transform duration-300 hover:scale-105"
        >
          <X size={16} strokeWidth={1.5} className="text-[#103f35]" />
        </button>
      </div>

      <div className="pt-5">
        <Link href={`/products/${item.slug}`} className="block">
          <h3 className="text-[13px] font-normal leading-[1.5] tracking-[0.01em] text-[#171717]">
            {item.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-[14px] font-semibold tracking-[-0.01em] text-[#171717]">
              ₹{item.price.toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <span className="text-[12px] text-neutral-400 line-through">
                ₹{item.compareAtPrice!.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </Link>

        {quantityInCart > 0 ? (
          <div className="mt-4 flex w-full items-center justify-between border border-[#103f35]">
            <button
              type="button"
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center text-[#103f35] transition-colors hover:bg-[#103f35]/10"
            >
              <Minus size={13} strokeWidth={1.6} />
            </button>

            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#103f35]">
              {quantityInCart} in bag
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center text-[#103f35] transition-colors hover:bg-[#103f35]/10"
            >
              <Plus size={13} strokeWidth={1.6} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAddToBag}
            className="mt-4 flex w-full items-center justify-center gap-2 border border-[#103f35] px-4 py-2.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#103f35] transition-colors hover:bg-[#103f35] hover:text-white"
          >
            <ShoppingBag size={13} strokeWidth={1.4} />
            Add to Bag
          </button>
        )}
      </div>
    </article>
  );
}
