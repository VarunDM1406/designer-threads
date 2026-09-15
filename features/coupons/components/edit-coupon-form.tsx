"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCoupon } from "../actions/update-coupon";
import type { Coupon } from "../types/coupon";

type Props = {
  coupon: Coupon;
};

function formatDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);

  return localDate.toISOString().slice(0, 16);
}

export default function EditCouponForm({ coupon }: Props) {
  const router = useRouter();

  const [code, setCode] = useState(coupon.code);
  const [name, setName] = useState(coupon.name);
  const [description, setDescription] = useState(
    coupon.description ?? ""
  );

  const [discountType, setDiscountType] = useState<
    "percentage" | "fixed"
  >(coupon.discount_type);

  const [discountValue, setDiscountValue] = useState(
    String(coupon.discount_value)
  );

  const [minimumOrderAmount, setMinimumOrderAmount] = useState(
    String(coupon.minimum_order_amount)
  );

  const [maximumDiscountAmount, setMaximumDiscountAmount] =
    useState(
      coupon.maximum_discount_amount !== null
        ? String(coupon.maximum_discount_amount)
        : ""
    );

  const [usageLimit, setUsageLimit] = useState(
    coupon.usage_limit !== null
      ? String(coupon.usage_limit)
      : ""
  );

  const [perCustomerLimit, setPerCustomerLimit] = useState(
    String(coupon.per_customer_limit)
  );

  const [startsAt, setStartsAt] = useState(
    formatDateTimeLocal(coupon.starts_at)
  );

  const [expiresAt, setExpiresAt] = useState(
    formatDateTimeLocal(coupon.expires_at)
  );

  const [isActive, setIsActive] = useState(
    coupon.is_active
  );

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

      await updateCoupon({
        id: coupon.id,

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

        is_active: isActive,
      });

      router.push("/admin/coupons");
      router.refresh();
    } catch (error) {
      console.error("UPDATE COUPON ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update coupon."
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
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Coupon Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

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
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>

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
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

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
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

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
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

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

        <div className="flex items-center gap-3">
          <input
            id="is-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
            className="h-4 w-4"
          />

          <label
            htmlFor="is-active"
            className="text-sm font-medium"
          >
            Coupon is active
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Coupon"}
        </button>
      </div>
    </form>
  );
}