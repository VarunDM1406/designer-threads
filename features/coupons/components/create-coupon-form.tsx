"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCoupon } from "../actions/create-coupon";

export default function CreateCouponForm() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [discountType, setDiscountType] = useState<
    "percentage" | "fixed"
  >("percentage");

  const [discountValue, setDiscountValue] = useState("");
  const [minimumOrderAmount, setMinimumOrderAmount] = useState("");
  const [maximumDiscountAmount, setMaximumDiscountAmount] =
    useState("");

  const [usageLimit, setUsageLimit] = useState("");
  const [perCustomerLimit, setPerCustomerLimit] = useState("1");

  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!code.trim()) {
      alert("Coupon code is required.");
      return;
    }

    if (!name.trim()) {
      alert("Coupon name is required.");
      return;
    }

    if (!discountValue) {
      alert("Discount value is required.");
      return;
    }

    if (
      discountType === "percentage" &&
      Number(discountValue) > 100
    ) {
      alert("Percentage discount cannot exceed 100%.");
      return;
    }

    try {
      setLoading(true);

      await createCoupon({
        code,
        name,
        description,

        discount_type: discountType,
        discount_value: Number(discountValue),

        minimum_order_amount: minimumOrderAmount
          ? Number(minimumOrderAmount)
          : 0,

        maximum_discount_amount: maximumDiscountAmount
          ? Number(maximumDiscountAmount)
          : null,

        usage_limit: usageLimit
          ? Number(usageLimit)
          : null,

        per_customer_limit: perCustomerLimit
          ? Number(perCustomerLimit)
          : 1,

        starts_at: startsAt
          ? new Date(startsAt).toISOString()
          : null,

        expires_at: expiresAt
          ? new Date(expiresAt).toISOString()
          : null,
      });

      router.push("/admin/coupons");
      router.refresh();
    } catch (error) {
      console.error("CREATE COUPON ERROR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create coupon."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-2xl border bg-white p-6"
    >
      <div className="space-y-5">

        {/* Code */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Coupon Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.toUpperCase())
            }
            placeholder="WELCOME10"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Coupon Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Welcome Discount"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="10% off for new customers"
            rows={3}
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Discount Type */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Discount Type
          </label>

          <select
            value={discountType}
            onChange={(e) =>
              setDiscountType(
                e.target.value as "percentage" | "fixed"
              )
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          >
            <option value="percentage">
              Percentage
            </option>

            <option value="fixed">
              Fixed Amount
            </option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Discount Value
          </label>

          <input
            type="number"
            min="0"
            value={discountValue}
            onChange={(e) =>
              setDiscountValue(e.target.value)
            }
            placeholder={
              discountType === "percentage"
                ? "10"
                : "500"
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Minimum Order */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Minimum Order Amount
          </label>

          <input
            type="number"
            min="0"
            value={minimumOrderAmount}
            onChange={(e) =>
              setMinimumOrderAmount(e.target.value)
            }
            placeholder="0"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Maximum Discount */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Maximum Discount Amount
          </label>

          <input
            type="number"
            min="0"
            value={maximumDiscountAmount}
            onChange={(e) =>
              setMaximumDiscountAmount(e.target.value)
            }
            placeholder="Optional"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Usage Limit */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Usage Limit
          </label>

          <input
            type="number"
            min="1"
            value={usageLimit}
            onChange={(e) =>
              setUsageLimit(e.target.value)
            }
            placeholder="Unlimited"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Per Customer */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Per Customer Limit
          </label>

          <input
            type="number"
            min="1"
            value={perCustomerLimit}
            onChange={(e) =>
              setPerCustomerLimit(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Starts At */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Starts At
          </label>

          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) =>
              setStartsAt(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Expires At */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Expires At
          </label>

          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) =>
              setExpiresAt(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create Coupon"}
        </button>
      </div>
    </form>
  );
}