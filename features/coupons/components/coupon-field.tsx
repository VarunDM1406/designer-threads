"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Tag, X } from "lucide-react";

import { useCart } from "@/features/cart/context/cart-context";
import { getAvailableCoupons } from "../actions/get-available-coupons";
import type { Coupon } from "../types/coupon";
import CouponCelebration from "./coupon-celebration";

type Props = {
  profileId?: string | null;
  dark?: boolean;
};

function describeCoupon(coupon: Coupon): string {
  return coupon.discount_type === "percentage"
    ? `${coupon.discount_value}% off`
    : `₹${Number(coupon.discount_value).toLocaleString("en-IN")} off`;
}

export default function CouponField({ profileId, dark }: Props) {
  const {
    subtotal,
    appliedCoupon,
    couponMessage,
    applyingCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [code, setCode] = useState("");
  const [showAvailable, setShowAvailable] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [loadingAvailable, setLoadingAvailable] = useState(false);
  const [celebration, setCelebration] = useState<{
    code: string;
    amountSaved: number;
  } | null>(null);

  useEffect(() => {
    if (!showAvailable) return;

    let cancelled = false;
    setLoadingAvailable(true);

    getAvailableCoupons(subtotal).then((coupons) => {
      if (!cancelled) {
        setAvailableCoupons(coupons);
        setLoadingAvailable(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [showAvailable, subtotal]);

  async function handleApply(applyCode?: string) {
    const target = applyCode ?? code;
    if (!target.trim()) return;

    const result = await applyCoupon(target, profileId);
    setCode("");
    setShowAvailable(false);

    if (result.success && result.discountAmount) {
      setCelebration({
        code: target.trim().toUpperCase(),
        amountSaved: result.discountAmount,
      });
    }
  }

  const mutedText = dark ? "text-white/60" : "text-[#60716e]";
  const border = dark ? "border-white/20" : "border-[#ddd6ca]";
  const inputText = dark ? "text-white placeholder:text-white/40" : "text-[#171717]";
  const panelBg = dark ? "bg-[#0b2b21]" : "bg-white";
  const hoverBg = dark ? "hover:bg-white/10" : "hover:bg-[#f4f0e8]";

  return (
    <div className={`border-t ${border} pt-5`}>
      {appliedCoupon ? (
        <div
          className={`flex items-center justify-between gap-3 border ${border} px-4 py-3`}
        >
          <div className="flex items-center gap-2">
            <Tag size={14} strokeWidth={1.5} />

            <span className="text-[12px] font-medium uppercase tracking-[0.08em]">
              {appliedCoupon.code}
            </span>
          </div>

          <button
            type="button"
            onClick={removeCoupon}
            aria-label="Remove coupon"
            className={`${mutedText} transition-colors hover:opacity-70`}
          >
            <X size={14} strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(event) =>
                setCode(event.target.value.toUpperCase())
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleApply();
                }
              }}
              placeholder="Coupon code"
              className={`h-11 flex-1 border ${border} bg-transparent px-3 text-[12px] uppercase tracking-[0.05em] outline-none ${inputText}`}
            />

            <button
              type="button"
              onClick={() => handleApply()}
              disabled={applyingCoupon || !code.trim()}
              className={`h-11 shrink-0 border ${border} px-4 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                dark ? "text-white hover:bg-white/10" : "text-[#103f35] hover:bg-[#f4f0e8]"
              }`}
            >
              {applyingCoupon ? "Checking..." : "Apply"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAvailable((current) => !current)}
            className={`mt-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] ${mutedText} transition-colors hover:opacity-80`}
          >
            View available coupons
            <ChevronDown
              size={13}
              strokeWidth={1.5}
              className={`transition-transform ${showAvailable ? "rotate-180" : ""}`}
            />
          </button>

          {showAvailable && (
            <div className={`mt-3 border ${border} ${panelBg}`}>
              {loadingAvailable ? (
                <p className={`p-4 text-[12px] ${mutedText}`}>
                  Loading coupons...
                </p>
              ) : availableCoupons.length === 0 ? (
                <p className={`p-4 text-[12px] ${mutedText}`}>
                  No coupons available for this order.
                </p>
              ) : (
                <ul className={`divide-y ${dark ? "divide-white/10" : "divide-[#ddd6ca]"}`}>
                  {availableCoupons.map((coupon) => (
                    <li
                      key={coupon.id}
                      className={`flex items-center justify-between gap-3 p-3 ${hoverBg}`}
                    >
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.05em]">
                          {coupon.code}
                        </p>

                        <p className={`mt-0.5 text-[11px] ${mutedText}`}>
                          {describeCoupon(coupon)}
                          {coupon.name ? ` — ${coupon.name}` : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApply(coupon.code)}
                        disabled={applyingCoupon}
                        className={`shrink-0 border ${border} px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors disabled:opacity-40 ${
                          dark ? "text-white hover:bg-white/10" : "text-[#103f35] hover:bg-[#f4f0e8]"
                        }`}
                      >
                        Apply
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {couponMessage && (
        <p
          className={`mt-2 text-[11px] ${
            appliedCoupon ? "text-[#0d4037]" : "text-[#b42318]"
          }`}
        >
          {couponMessage}
        </p>
      )}

      {celebration && (
        <CouponCelebration
          code={celebration.code}
          amountSaved={celebration.amountSaved}
          onClose={() => setCelebration(null)}
        />
      )}
    </div>
  );
}
