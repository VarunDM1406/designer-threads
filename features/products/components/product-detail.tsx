"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useCart } from "@/features/cart/context/cart-context";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import { useShippingConfig } from "@/features/settings/hooks/use-shipping-config";

type ProductDetailProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    sku?: string | null;
    short_description: string | null;
    description: string | null;
    fabric?: string | null;
    care_instructions?: string | null;
    price: number | string;
    compare_at_price?: number | string | null;
    stock_quantity?: number | null;
    is_active: boolean;
    is_featured: boolean;
    is_new_arrival?: boolean | null;
    is_best_seller?: boolean | null;

    product_images?: {
      id: string;
      image_url: string;
      alt_text?: string | null;
      is_primary?: boolean | null;
      display_order?: number | null;
    }[];

    product_variants?: {
      id: string;
      sku: string;
      size?: string | null;
      color?: string | null;
      price: number | string;
      stock_quantity: number;
      is_active?: boolean | null;
    }[];
  };
};

export default function ProductDetail({
  product,
}: ProductDetailProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { shippingCharge, freeShippingThreshold } = useShippingConfig();

  const wishlisted = isInWishlist(product.id);

  const images = useMemo(() => {
    return [...(product.product_images ?? [])].sort(
      (a, b) =>
        (a.display_order ?? 0) -
        (b.display_order ?? 0)
    );
  }, [product.product_images]);

  // Variants are an optional, per-product layer on top of the product's
  // own price/stock — most products have none, since there's no admin UI
  // to create them yet. When present, they override price/stock/SKU for
  // the selected size/color; compare-at price always comes from the
  // product itself, since variants don't carry their own MRP.
  const activeVariants = useMemo(
    () =>
      (product.product_variants ?? []).filter(
        (variant) => variant.is_active !== false
      ),
    [product.product_variants]
  );

  const hasVariants = activeVariants.length > 0;

  const [selectedImage, setSelectedImage] = useState(
    images.find((image) => image.is_primary) ??
      images[0] ??
      null
  );

  const [selectedVariantId, setSelectedVariantId] =
    useState<string | null>(
      activeVariants[0]?.id ?? null
    );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [shared, setShared] = useState(false);

  const selectedVariant = hasVariants
    ? activeVariants.find(
        (variant) => variant.id === selectedVariantId
      ) ?? activeVariants[0]
    : null;

  const price = selectedVariant
    ? Number(selectedVariant.price)
    : Number(product.price);

  const compareAtPrice = product.compare_at_price
    ? Number(product.compare_at_price)
    : null;

  const hasDiscount =
    compareAtPrice !== null && compareAtPrice > price;

  const discountPercent = hasDiscount
    ? Math.round((1 - price / compareAtPrice!) * 100)
    : null;

  const inventory = selectedVariant
    ? Number(selectedVariant.stock_quantity)
    : Number(product.stock_quantity ?? 0);

  const isOutOfStock = inventory <= 0;

  const activeSku = selectedVariant?.sku ?? product.sku ?? null;

  function variantLabel(variant: NonNullable<
    typeof selectedVariant
  >) {
    const parts = [variant.size, variant.color].filter(Boolean);
    return parts.length > 0 ? parts.join(" / ") : variant.sku;
  }

  function handleAddToCart() {
    if (isOutOfStock) return;

    addItem({
      id: selectedVariant?.id ?? product.id,
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      sku: activeSku ?? undefined,
      size: selectedVariant?.size ?? null,
      color: selectedVariant?.color ?? null,
      price,
      quantity,
      image: selectedImage?.image_url ?? null,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  function handleBuyNow() {
    if (isOutOfStock) return;

    addItem({
      id: selectedVariant?.id ?? product.id,
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      sku: activeSku ?? undefined,
      size: selectedVariant?.size ?? null,
      color: selectedVariant?.color ?? null,
      price,
      quantity,
      image: selectedImage?.image_url ?? null,
    });

    router.push("/checkout");
  }

  function handleWishlist() {
    toggleItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price,
      compareAtPrice,
      image: selectedImage?.image_url ?? null,
    });
  }

  async function handleShare() {
    const url =
      typeof window !== "undefined" ? window.location.href : "";

    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {
        // user cancelled or share failed — fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
  }

  function decreaseQuantity() {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  }

  function increaseQuantity() {
    setQuantity((current) =>
      Math.min(Math.max(1, inventory), current + 1)
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Images */}
      <div>
        <div className="overflow-hidden rounded-[2px] bg-[#efede7]">
          {selectedImage?.image_url ? (
            <img
              src={selectedImage.image_url}
              alt={
                selectedImage.alt_text ||
                product.name
              }
              className="aspect-[4/5] h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center text-[13px] text-[#60716e]">
              No Image
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.map((image) => {
              const isSelected =
                selectedImage?.id === image.id;

              return (
                <button
                  key={image.id}
                  type="button"
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className={`overflow-hidden rounded-[2px] border transition-colors ${
                    isSelected
                      ? "border-[#103f35]"
                      : "border-[#ddd6ca] hover:border-[#103f35]/40"
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={
                      image.alt_text ||
                      product.name
                    }
                    className="aspect-square w-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="flex flex-col">
        <div>
          {/* BADGES */}
          {(product.is_best_seller ||
            product.is_new_arrival ||
            hasDiscount ||
            product.is_featured) && (
            <div className="flex flex-wrap gap-1.5">
              {product.is_best_seller && (
                <span className="bg-[#0d4037] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.2em] text-white">
                  Bestseller
                </span>
              )}

              {product.is_new_arrival && (
                <span className="border border-[#0d4037]/30 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.2em] text-[#0d4037]">
                  New
                </span>
              )}

              {hasDiscount && (
                <span className="border border-[#0d4037]/30 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.2em] text-[#0d4037]">
                  Sale
                </span>
              )}

              {product.is_featured && (
                <span className="bg-[#a87932] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.2em] text-white">
                  Featured
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="font-serif text-3xl tracking-[-0.03em] text-[#103f35] sm:text-4xl">
              {product.name}
            </h1>

            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this piece"
              className="mt-1 flex shrink-0 items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              <Share2 size={15} strokeWidth={1.5} />
              {shared ? "Copied" : "Share"}
            </button>
          </div>

          {product.short_description && (
            <p className="mt-4 text-[14px] leading-7 text-[#60716e]">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-[22px] font-semibold tracking-[-0.01em] text-[#171717]">
            ₹{price.toLocaleString("en-IN")}
          </span>

          {hasDiscount && (
            <>
              <span className="text-[16px] text-neutral-400 line-through">
                ₹
                {compareAtPrice!.toLocaleString(
                  "en-IN"
                )}
              </span>

              <span className="text-[12px] font-medium text-[#0d4037]">
                {discountPercent}% off
              </span>
            </>
          )}
        </div>

        {/* Variant selector */}
        {hasVariants && activeVariants.length > 1 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                Select Option
              </span>

              {activeSku && (
                <span className="text-[11px] text-[#60716e]">
                  SKU: {activeSku}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {activeVariants.map((variant) => {
                const selected =
                  variant.id ===
                  selectedVariant?.id;

                const unavailable =
                  Number(variant.stock_quantity) <= 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={unavailable}
                    onClick={() => {
                      setSelectedVariantId(
                        variant.id
                      );
                      setQuantity(1);
                    }}
                    className={`border px-4 py-3 text-[13px] transition-colors ${
                      selected
                        ? "border-[#103f35] bg-[#103f35] text-white"
                        : "border-[#ddd6ca] bg-white text-[#171717] hover:border-[#103f35]"
                    } ${
                      unavailable
                        ? "cursor-not-allowed opacity-40"
                        : ""
                    }`}
                  >
                    {variantLabel(variant)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stock */}
        <div className="mt-5">
          {isOutOfStock ? (
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#b42318]">
              Out of stock
            </p>
          ) : inventory <= 5 ? (
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#a87932]">
              Only {inventory} left in stock
            </p>
          ) : (
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#0d4037]">
              In stock
            </p>
          )}
        </div>

        {/* Quantity + Add */}
        <div className="mt-6 flex gap-3">
          <div className="flex items-center border border-[#ddd6ca] bg-white">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={isOutOfStock}
              className="p-3 text-[#103f35] transition-colors hover:bg-[#f4f0e8] disabled:opacity-40"
            >
              <Minus size={16} strokeWidth={1.5} />
            </button>

            <span className="min-w-10 text-center text-[13px] font-medium text-[#171717]">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={
                isOutOfStock ||
                quantity >= inventory
              }
              className="p-3 text-[#103f35] transition-colors hover:bg-[#f4f0e8] disabled:opacity-40"
            >
              <Plus size={16} strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex flex-1 items-center justify-center gap-2 bg-[#103f35] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            <ShoppingBag size={16} strokeWidth={1.5} />

            {added
              ? "Added to Cart"
              : isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
          </button>

          <button
            type="button"
            onClick={handleWishlist}
            aria-label={
              wishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center border border-[#ddd6ca] text-[#103f35] transition-colors hover:bg-[#f4f0e8]"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={
                wishlisted
                  ? "fill-[#0d4037] text-[#0d4037]"
                  : "text-[#103f35]"
              }
            />
          </button>
        </div>

        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleBuyNow}
            className="mt-3 w-full border border-[#103f35] py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#103f35] transition-colors hover:bg-[#103f35] hover:text-white"
          >
            Order Now
          </button>
        )}

        {/* Shipping note */}
        <div className="mt-5 flex items-center gap-2.5 text-[12px] text-[#60716e]">
          <Truck size={16} strokeWidth={1.5} className="shrink-0" />
          {freeShippingThreshold > 0 ? (
            <>
              Free shipping on orders over ₹
              {freeShippingThreshold.toLocaleString("en-IN")}
            </>
          ) : shippingCharge === 0 ? (
            "Free shipping on all orders"
          ) : (
            <>Shipping ₹{shippingCharge.toLocaleString("en-IN")}</>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-10 border-t border-[#ddd6ca] pt-8">
            <h2 className="font-serif text-lg text-[#103f35]">
              Description
            </h2>

            <div className="mt-4 whitespace-pre-line text-[13px] leading-7 text-[#60716e]">
              {product.description}
            </div>
          </div>
        )}

        {/* Fabric & Care */}
        {(product.fabric || product.care_instructions) && (
          <div className="mt-8 border-t border-[#ddd6ca] pt-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              Fabric &amp; Care
            </h2>

            <div className="mt-4 space-y-3 text-[13px]">
              {product.fabric && (
                <div className="flex justify-between gap-6">
                  <span className="shrink-0 text-[#60716e]">
                    Fabric
                  </span>

                  <span className="text-right text-[#171717]">
                    {product.fabric}
                  </span>
                </div>
              )}

              {product.care_instructions && (
                <div className="flex justify-between gap-6">
                  <span className="shrink-0 text-[#60716e]">
                    Care
                  </span>

                  <span className="text-right text-[#171717]">
                    {product.care_instructions}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product information */}
        <div className="mt-8 border-t border-[#ddd6ca] pt-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
            Product Information
          </h2>

          <div className="mt-4 space-y-3 text-[13px]">
            {activeSku && (
              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  SKU
                </span>

                <span className="text-[#171717]">
                  {activeSku}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-[#60716e]">
                Availability
              </span>

              <span className="text-[#171717]">
                {isOutOfStock
                  ? "Out of stock"
                  : "Available"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
