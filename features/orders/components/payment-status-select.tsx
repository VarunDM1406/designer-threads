"use client";

import { useState, useTransition } from "react";
import { updatePaymentStatus } from "../actions/update-payment-status";
import type { PaymentStatus } from "../types/order";

type Props = {
  orderId: string;
  currentStatus: PaymentStatus;
};

const statuses: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export default function PaymentStatusSelect({
  orderId,
  currentStatus,
}: Props) {
  const [status, setStatus] =
    useState<PaymentStatus>(currentStatus);

  const [message, setMessage] =
    useState<"idle" | "saving" | "saved" | "error">("idle");

  const [isPending, startTransition] =
    useTransition();

  const handleChange = (
    value: PaymentStatus
  ) => {
    const previousStatus = status;

    setStatus(value);
    setMessage("saving");

    startTransition(async () => {
      const result =
        await updatePaymentStatus(
          orderId,
          value
        );

      if (!result.success) {
        setStatus(previousStatus);
        setMessage("error");

        setTimeout(() => {
          setMessage("idle");
        }, 3000);

        return;
      }

      setMessage("saved");

      setTimeout(() => {
        setMessage("idle");
      }, 2000);
    });
  };

  return (
    <div className="space-y-2">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) =>
          handleChange(
            e.target.value as PaymentStatus
          )
        }
        className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
      >
        {statuses.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item.charAt(0).toUpperCase() +
              item.slice(1)}
          </option>
        ))}
      </select>

      <div className="min-h-[20px] text-xs">
        {message === "saving" && (
          <span className="text-gray-500">
            Saving...
          </span>
        )}

        {message === "saved" && (
          <span className="font-medium text-green-600">
            ✓ Saved
          </span>
        )}

        {message === "error" && (
          <span className="font-medium text-red-600">
            ✕ Failed to save
          </span>
        )}
      </div>
    </div>
  );
}