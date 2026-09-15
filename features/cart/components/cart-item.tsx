"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartItem as CartItemType } from "../types/cart";
import { useCart } from "../context/cart-context";

export default function CartItem({
  item,
}: {
  item: CartItemType;
}) {
  const {
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <div className="flex gap-5 border-b border-neutral-200 py-6">
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-neutral-400">
            No image
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium">
            {item.name}
          </h3>

          {item.sku && (
            <p className="mt-1 text-sm text-neutral-500">
              SKU: {item.sku}
            </p>
          )}

          {(item.size || item.color) && (
            <div className="mt-2 flex gap-3 text-sm text-neutral-500">
              {item.size && <span>Size: {item.size}</span>}
              {item.color && <span>Color: {item.color}</span>}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity - 1
                )
              }
              className="p-2 hover:bg-neutral-100"
            >
              <Minus size={15} />
            </button>

            <span className="min-w-10 text-center text-sm">
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
              className="p-2 hover:bg-neutral-100"
            >
              <Plus size={15} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.id)}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-semibold">
          ₹
          {(item.price * item.quantity).toLocaleString(
            "en-IN"
          )}
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          ₹{item.price.toLocaleString("en-IN")} each
        </p>
      </div>
    </div>
  );
}