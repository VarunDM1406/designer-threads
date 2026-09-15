import PageHeader from "@/components/ui/page-header";
import CreateCouponForm from "@/features/coupons/components/create-coupon-form";

export default function NewCouponPage() {
  return (
    <>
      <PageHeader
        title="Create Coupon"
        description="Create a new discount code."
      />

      <CreateCouponForm />
    </>
  );
}