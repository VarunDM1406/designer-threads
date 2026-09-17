import PageHeader from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditCouponForm from "@/features/coupons/components/edit-coupon-form";

export default async function EditCouponPage({
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
        title="Edit Coupon"
        description="Update coupon details and settings."
      />

      <EditCouponForm coupon={coupon} />
    </>
  );
}