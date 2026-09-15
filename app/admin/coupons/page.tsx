import Link from "next/link";
import PageHeader from "@/components/ui/page-header";
import CouponTable from "@/features/coupons/components/coupon-table";
import { getCoupons } from "@/features/coupons/actions/get-coupons";

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <>
      <div className="flex items-center justify-between">
        <PageHeader
          title="Coupons"
          description="Manage discount codes and promotions."
        />

        <Link
          href="/admin/coupons/new"
          className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
        >
          + Create Coupon
        </Link>
      </div>

      <CouponTable coupons={coupons} />
    </>
  );
}