"use client";

import Link from "next/link";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/context/cart-context";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import { useState } from "react";

type ProductCardProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    compare_at_price?: number | string | null;
    short_description?: string | null;
    brand?: string | null;
    is_best_seller?: boolean | null;
    is_new_arrival?: boolean | null;
    is_active?: boolean | null;
    stock_quantity?: number | null;
    product_images?: {
      id?: string;
      image_url: string;
      alt_text?: string | null;
      is_primary?: boolean | null;
      display_order?: number | null;
    }[];
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [activeImage, setActiveImage] = useState(0);

  const cartItem = items.find(
    (item) => item.productId === product.id
  );
  const quantityInCart = cartItem?.quantity ?? 0;

  const wishlisted = isInWishlist(product.id);

  const images = Array.isArray(product.product_images)
    ? product.product_images
    : [];

  const sortedImages = [...images].sort(
    (a, b) =>
      (a.display_order ?? 0) -
      (b.display_order ?? 0)
  );

  const primaryImage =
    sortedImages.find((image) => image.is_primary) ??
    sortedImages[0];

  const price = Number(product.price);

  const comparePrice =
    product.compare_at_price != null
      ? Number(product.compare_at_price)
      : null;

  const hasDiscount =
    comparePrice !== null && comparePrice > price;

  const isOutOfStock =
    product.stock_quantity !== undefined &&
    product.stock_quantity !== null &&
    product.stock_quantity <= 0;

  const displayedImage =
    sortedImages[activeImage] ?? primaryImage;

  function handleAddToCart(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      image: displayedImage?.image_url ?? null,
    });
  }

  function handleIncrease(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!cartItem) return;
    updateQuantity(cartItem.id, cartItem.quantity + 1);
  }

  function handleDecrease(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!cartItem) return;
    updateQuantity(cartItem.id, cartItem.quantity - 1);
  }

  function handleWishlist(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    toggleItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price,
      compareAtPrice: comparePrice,
      image: displayedImage?.image_url ?? null,
    });
  }

  return (
    <article className="group min-w-0">

      {/* IMAGE */}
      <div className="relative">

        <Link
          href={`/products/${product.slug}`}
          className="block"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-[#efede7]">

            {displayedImage?.image_url ? (
              <img
                src={displayedImage.image_url}
                alt={
                  displayedImage.alt_text ||
                  product.name
                }
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                Image coming soon
              </div>
            )}

            {/* BADGES */}
            <div className="absolute left-4 top-4 flex flex-col items-start gap-1.5">
              {product.is_best_seller && (
                <span className="bg-[#0d4037] px-2.5 py-[5px] text-[8px] font-medium uppercase tracking-[0.2em] text-white">
                  Bestseller
                </span>
              )}

              {product.is_new_arrival && (
                <span className="bg-white/95 px-2.5 py-[5px] text-[8px] font-medium uppercase tracking-[0.2em] text-[#0d4037]">
                  New
                </span>
              )}

              {hasDiscount && (
                <span className="bg-white/95 px-2.5 py-[5px] text-[8px] font-medium uppercase tracking-[0.2em] text-[#0d4037]">
                  Sale
                </span>
              )}
            </div>

            {/* WISHLIST */}
            <button
              type="button"
              onClick={handleWishlist}
              aria-label={
                wishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 transition-transform duration-300 hover:scale-105"
            >
              <Heart
                size={16}
                strokeWidth={1.35}
                className={
                  wishlisted
                    ? "fill-[#0d4037] text-[#0d4037]"
                    : "text-[#173d36]"
                }
              />
            </button>

            {/* IMAGE DOTS */}
            {sortedImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                {sortedImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setActiveImage(index);
                    }}
                    className={`h-1.5 w-1.5 rounded-full border border-white transition-all ${
                      index === activeImage
                        ? "bg-white"
                        : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* ADD TO BAG */}
            {!isOutOfStock && (
              <div
                className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
                  quantityInCart > 0
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                }`}
              >
                {quantityInCart > 0 ? (
                  <div className="flex w-full items-center justify-between bg-white/95 px-2 py-1.5 shadow-sm">
                    <button
                      type="button"
                      onClick={handleDecrease}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center text-[#0d4037] transition-colors hover:bg-[#0d4037]/10"
                    >
                      <Minus size={13} strokeWidth={1.6} />
                    </button>

                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#0d4037]">
                      {quantityInCart} in bag
                    </span>

                    <button
                      type="button"
                      onClick={handleIncrease}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center text-[#0d4037] transition-colors hover:bg-[#0d4037]/10"
                    >
                      <Plus size={13} strokeWidth={1.6} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex w-full items-center justify-center gap-2 bg-white/95 px-4 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#0d4037] shadow-sm transition-colors hover:bg-[#0d4037] hover:text-white"
                  >
                    <ShoppingBag
                      size={13}
                      strokeWidth={1.4}
                    />
                    Add to bag
                  </button>
                )}
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* PRODUCT INFO */}
      <div className="relative pt-5">

        <Link
          href={`/products/${product.slug}`}
          className="block pr-9"
        >

          {/* NAME */}
          <h3 className="text-[13px] font-normal leading-[1.5] tracking-[0.01em] text-[#171717]">
            {product.name}
          </h3>

          {/* PRICE */}
          <div className="mt-2 flex items-baseline gap-2.5">
            <span className="text-[14px] font-semibold tracking-[-0.01em] text-[#171717]">
              ₹{price.toLocaleString("en-IN")}
            </span>

            {hasDiscount && (
              <span className="text-[12px] text-neutral-400 line-through">
                ₹{comparePrice!.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {isOutOfStock && (
            <p className="mt-2 text-[8px] font-medium uppercase tracking-[0.18em] text-neutral-400">
              Out of stock
            </p>
          )}
        </Link>

        {/* QUICK ADD */}
        {!isOutOfStock &&
          (quantityInCart > 0 ? (
            <div className="absolute right-0 top-3 flex items-center gap-1 rounded-full border border-[#0d4037]/20 px-1 py-1">
              <button
                type="button"
                onClick={handleDecrease}
                aria-label="Decrease quantity"
                className="flex h-6 w-6 items-center justify-center rounded-full text-[#0d4037] transition-colors hover:bg-[#0d4037]/10"
              >
                <Minus size={12} strokeWidth={1.6} />
              </button>

              <span className="min-w-[14px] text-center text-[11px] font-medium text-[#0d4037]">
                {quantityInCart}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
                className="flex h-6 w-6 items-center justify-center rounded-full text-[#0d4037] transition-colors hover:bg-[#0d4037]/10"
              >
                <Plus size={12} strokeWidth={1.6} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label="Add to bag"
              className="absolute right-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#0d4037]/20 text-[#0d4037] transition-all duration-300 hover:bg-[#0d4037] hover:text-white"
            >
              <Plus
                size={15}
                strokeWidth={1.3}
              />
            </button>
          ))}
      </div>
    </article>
  );
}