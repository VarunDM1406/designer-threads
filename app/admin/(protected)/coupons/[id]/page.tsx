import PageHeader from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CouponDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !coupon) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={coupon.code}
        description="View and manage coupon details."
      />

      <div className="max-w-3xl rounded-2xl border bg-white p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{coupon.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p>{coupon.description || "No description"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Discount</p>
            <p>
              {coupon.discount_type === "percentage"
                ? `${coupon.discount_value}%`
                : `₹${Number(
                    coupon.discount_value
                  ).toLocaleString("en-IN")}`}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Minimum Order
            </p>
            <p>
              ₹
              {Number(
                coupon.minimum_order_amount
              ).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Usage</p>
            <p>
              {coupon.usage_count}
              {coupon.usage_limit !== null
                ? ` / ${coupon.usage_limit}`
                : " / Unlimited"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p>
              {coupon.is_active ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Link
              href={`/admin/coupons/${coupon.id}/edit`}
              className="rounded-xl bg-black px-4 py-3 text-white"
            >
              Edit Coupon
            </Link>

            <Link
              href="/admin/coupons"
              className="rounded-xl border px-4 py-3"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}