"use client";

import { useEffect, useState } from "react";
import { PartyPopper } from "lucide-react";

type Props = {
  code: string;
  amountSaved: number;
  onClose: () => void;
};

const CONFETTI_COLORS = [
  "#103f35",
  "#a87932",
  "#0d4037",
  "#e8b04b",
  "#ddd6ca",
];

export default function CouponCelebration({
  code,
  amountSaved,
  onClose,
}: Props) {
  const [confetti] = useState(() =>
    Array.from({ length: 28 }, (_, index) => ({
      id: index,
      left: Math.random() * 100,
      delay: Math.random() * 0.3,
      duration: 1.6 + Math.random() * 0.9,
      color:
        CONFETTI_COLORS[
          Math.floor(Math.random() * CONFETTI_COLORS.length)
        ],
      rotate: Math.random() * 360,
    }))
  );

  useEffect(() => {
    const timeout = setTimeout(onClose, 2600);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <style>{`
        @keyframes coupon-confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(220px) rotate(360deg); opacity: 0; }
        }
        @keyframes coupon-celebration-pop {
          0% { transform: scale(0.85); opacity: 0; }
          60% { transform: scale(1.03); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 overflow-hidden">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            style={{
              position: "absolute",
              left: `${piece.left}%`,
              top: 0,
              width: 8,
              height: 8,
              backgroundColor: piece.color,
              animation: `coupon-confetti-fall ${piece.duration}s ease-in ${piece.delay}s both`,
              transform: `rotate(${piece.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div
        onClick={(event) => event.stopPropagation()}
        style={{ animation: "coupon-celebration-pop 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
        className="relative mx-6 flex max-w-[340px] flex-col items-center bg-white px-8 py-9 text-center shadow-xl"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0d4037]/10 text-[#0d4037]">
          <PartyPopper size={26} strokeWidth={1.5} />
        </div>

        <h3 className="mt-4 font-serif text-2xl tracking-[-0.02em] text-[#103f35]">
          Coupon Applied!
        </h3>

        <p className="mt-2 text-[13px] leading-6 text-[#60716e]">
          <span className="font-semibold text-[#103f35]">{code}</span>{" "}
          saved you
        </p>

        <p className="mt-1 font-serif text-3xl text-[#0d4037]">
          ₹{amountSaved.toLocaleString("en-IN")}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-[#103f35] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#0b2b21]"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
