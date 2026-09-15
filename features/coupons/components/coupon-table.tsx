"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCoupon } from "../actions/delete-coupon";
import type { Coupon } from "../types/coupon";

type Props = {
  coupons: Coupon[];
};

export default function CouponTable({ coupons }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCoupons = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return coupons;

    return coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(query)
    );
  }, [coupons, search]);

  async function handleDelete(id: string, code: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete coupon "${code}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteCoupon(id);

      router.refresh();
    } catch (error) {
      console.error("DELETE COUPON ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete coupon."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border bg-white">
      <div className="border-b p-4">
        <input
          type="text"
          placeholder="Search coupon code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Discount</th>
              <th className="px-4 py-3 text-left">Min. Order</th>
              <th className="px-4 py-3 text-left">Usage</th>
              <th className="px-4 py-3 text-left">Expires</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredCoupons.map((coupon) => (
              <tr key={coupon.id} className="border-b">
                <td className="px-4 py-4 font-semibold">
                  {coupon.code}
                </td>

                <td className="px-4 py-4">
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount_value}%`
                    : `₹${Number(
                        coupon.discount_value
                      ).toLocaleString("en-IN")}`}
                </td>

                <td className="px-4 py-4">
                  {Number(coupon.minimum_order_amount) > 0
                    ? `₹${Number(
                        coupon.minimum_order_amount
                      ).toLocaleString("en-IN")}`
                    : "None"}
                </td>

                <td className="px-4 py-4">
                  {coupon.usage_count}
                  {coupon.usage_limit !== null
                    ? ` / ${coupon.usage_limit}`
                    : " / Unlimited"}
                </td>

                <td className="px-4 py-4">
                  {coupon.expires_at
                    ? new Date(
                        coupon.expires_at
                      ).toLocaleDateString("en-IN")
                    : "No expiry"}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={
                      coupon.is_active
                        ? "font-medium text-green-600"
                        : "font-medium text-red-600"
                    }
                  >
                    {coupon.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/coupons/${coupon.id}`}
                      className="rounded-lg border px-3 py-1.5"
                    >
                      View
                    </Link>

                    <Link
                      href={`/admin/coupons/${coupon.id}/edit`}
                      className="rounded-lg border px-3 py-1.5"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={deletingId === coupon.id}
                      onClick={() =>
                        handleDelete(coupon.id, coupon.code)
                      }
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 disabled:opacity-50"
                    >
                      {deletingId === coupon.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCoupons.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No coupons found.
        </div>
      )}
    </div>
  );
}