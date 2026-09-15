"use client";

import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/features/cart/context/cart-context";
import CartRecommendations from "@/features/cart/components/cart-recommendations";
import CouponField from "@/features/coupons/components/coupon-field";
import { useShippingConfig } from "@/features/settings/hooks/use-shipping-config";
import { calculateShipping } from "@/lib/shipping";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
  } = useCart();

  const { shippingCharge, freeShippingThreshold } = useShippingConfig();

  const shipping = calculateShipping(
    subtotal,
    shippingCharge,
    freeShippingThreshold
  );
  const total = Math.max(0, subtotal - discount + shipping);

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

        <main className="min-h-screen bg-white px-6 py-16 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-12">
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
                Shopping Bag
              </p>

              <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[#103f35] sm:text-5xl">
                Your Cart
              </h1>
            </div>

            <div className="flex min-h-[420px] items-center justify-center border border-[#ddd6ca] bg-white">
              <div className="max-w-md px-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f0e8]">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#103f35"
                    strokeWidth="1.5"
                  >
                    <path d="M6 8h12l1 13H5L6 8Z" />
                    <path d="M9 8a3 3 0 0 1 6 0" />
                  </svg>
                </div>

                <h2 className="mt-7 font-serif text-3xl tracking-[-0.02em] text-[#103f35]">
                  Your bag is empty
                </h2>

                <p className="mt-3 text-[13px] leading-6 text-[#60716e]">
                  Explore the collection and find something you&apos;ll love.
                </p>

                <Link
                  href="/shop"
                  className="mt-8 inline-flex bg-[#103f35] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            <CartRecommendations />
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-12 md:px-10 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1200px]">
          {/* Header */}
          <div className="mb-10">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Shopping Bag
            </p>

            <div className="mt-3 flex items-end justify-between gap-4">
              <h1 className="font-serif text-4xl tracking-[-0.03em] text-[#103f35] sm:text-5xl">
                Your Cart
              </h1>

              <p className="text-[13px] text-[#60716e]">
                {items.length}{" "}
                {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <section className="border border-[#ddd6ca] bg-white">
              <div className="border-b border-[#ddd6ca] px-6 py-5">
                <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#103f35]">
                  Items
                </h2>
              </div>

              <div className="divide-y divide-[#ddd6ca]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 p-6"
                  >
                    {/* Product Image */}
                    <div className="h-32 w-24 shrink-0 overflow-hidden rounded-[2px] bg-[#f4f0e8]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-[#60716e]">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-[14px] font-medium text-[#171717]">
                              {item.name}
                            </h3>

                            {item.sku && (
                              <p className="mt-1 text-[11px] text-[#60716e]">
                                SKU: {item.sku}
                              </p>
                            )}

                            {(item.size || item.color) && (
                              <div className="mt-2 flex gap-3 text-[11px] text-[#60716e]">
                                {item.size && (
                                  <span>
                                    Size: {item.size}
                                  </span>
                                )}

                                {item.color && (
                                  <span>
                                    Color: {item.color}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          <p className="whitespace-nowrap text-[14px] font-semibold text-[#171717]">
                            ₹
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity */}
                        <div className="flex items-center border border-[#ddd6ca]">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-lg text-[#60716e] hover:text-[#103f35]"
                          >
                            −
                          </button>

                          <span className="w-8 text-center text-[13px] text-[#171717]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center text-lg text-[#60716e] hover:text-[#103f35]"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#60716e] transition-colors hover:text-[#103f35]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="border-t border-[#ddd6ca] px-6 py-5">
                <Link
                  href="/shop"
                  className="text-[13px] font-medium text-[#103f35] underline underline-offset-4"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </section>

            {/* Summary */}
            <aside className="h-fit bg-[#103f35] p-7 text-white lg:sticky lg:top-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/60">
                Order Summary
              </p>

              <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em]">
                Your Order
              </h2>

              <div className="mt-8 space-y-5 border-b border-white/15 pb-6">
                <div className="flex justify-between text-[13px]">
                  <span className="text-white/60">
                    Subtotal
                  </span>

                  <span>
                    ₹
                    {Number(subtotal).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[13px]">
                  <span className="text-white/60">
                    Shipping
                  </span>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping.toLocaleString(
                          "en-IN"
                        )}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-white/60">Discount</span>

                    <span>
                      −₹{discount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {freeShippingThreshold > 0 &&
                  subtotal > 0 &&
                  subtotal < freeShippingThreshold && (
                    <p className="text-[12px] leading-5 text-white/50">
                      Add ₹
                      {(freeShippingThreshold - subtotal).toLocaleString(
                        "en-IN"
                      )}{" "}
                      more to get free shipping.
                    </p>
                  )}
              </div>

              <CouponField dark />

              <div className="flex items-center justify-between pt-6">
                <span className="text-[13px] text-white/60">
                  Total
                </span>

                <span className="font-serif text-3xl">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <Link
                href="/checkout"
                className="mt-7 block bg-white px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#103f35] transition-colors hover:bg-[#f4f0e8]"
              >
                Proceed to Checkout
              </Link>

              <p className="mt-5 text-center text-[11px] text-white/50">
                Questions? Reach us on WhatsApp
              </p>
            </aside>
          </div>

          <CartRecommendations />
        </div>
      </main>

      <Footer />
    </>
  );
}
