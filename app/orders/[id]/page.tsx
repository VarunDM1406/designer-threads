import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailPage({
  params,
}: OrderPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the customer's profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  // Get ONLY this customer's order
  const { data: order, error } = await supabase
  .from("orders")
  .select(`
    id,
    order_number,
    subtotal,
    discount,
    shipping_charge,
    tax,
    total,
    payment_method,
    payment_status,
    order_status,
    created_at,
    order_items (
      id,
      product_variant_id,
      product_name,
      product_sku,
      size,
      color,
      unit_price,
      quantity,
      total_price,
      created_at
    )
  `)
  .eq("id", id)
  .eq("profile_id", profile.id)
  .maybeSingle();

  if (error) {
    console.error("ORDER DETAIL ERROR:", error);
    notFound();
  }

  if (!order) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-8">
            <Link
              href="/orders"
              className="text-[13px] text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              ← Back to My Orders
            </Link>

            <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Order
            </p>

            <h1 className="mt-1 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              #{order.order_number}
            </h1>

            <p className="mt-2 text-[13px] text-[#60716e]">
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Order Items */}
          <section className="mt-6 border border-[#ddd6ca] bg-white p-6">
            <h2 className="font-serif text-lg text-[#103f35]">
              Items
            </h2>

            <div className="mt-5 divide-y divide-[#ddd6ca]">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-6 py-5"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#171717]">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-[12px] text-[#60716e]">
                      SKU: {item.product_sku}
                    </p>

                    {item.size && (
                      <p className="mt-1 text-[12px] text-[#60716e]">
                        Size: {item.size}
                      </p>
                    )}

                    {item.color && (
                      <p className="mt-1 text-[12px] text-[#60716e]">
                        Color: {item.color}
                      </p>
                    )}

                    <p className="mt-1 text-[12px] text-[#60716e]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[12px] text-[#60716e]">
                      ₹{Number(item.unit_price).toLocaleString("en-IN")} each
                    </p>

                    <p className="mt-1 text-[14px] font-semibold text-[#171717]">
                      ₹{Number(item.total_price).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Status */}
          <section className="mt-6 border border-[#ddd6ca] bg-white p-6">
            <h2 className="font-serif text-lg text-[#103f35]">
              Order Status
            </h2>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="bg-[#f4f0e8] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#103f35]">
                {order.order_status}
              </span>

              <span className="bg-[#f4f0e8] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[#103f35]">
                Payment: {order.payment_status}
              </span>
            </div>
          </section>

          {/* Payment */}
          <section className="mt-6 border border-[#ddd6ca] bg-white p-6">
            <h2 className="font-serif text-lg text-[#103f35]">
              Payment
            </h2>

            <div className="mt-5 space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Payment method
                </span>

                <span className="font-medium capitalize text-[#171717]">
                  {order.payment_method || "Not specified"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Payment status
                </span>

                <span className="font-medium capitalize text-[#171717]">
                  {order.payment_status}
                </span>
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <section className="mt-6 border border-[#ddd6ca] bg-white p-6">
            <h2 className="font-serif text-lg text-[#103f35]">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4 text-[13px]">

              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Subtotal
                </span>

                <span className="text-[#171717]">
                  ₹{Number(order.subtotal).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Discount
                </span>

                <span className="text-[#171717]">
                  - ₹{Number(order.discount).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Shipping
                </span>

                <span className="text-[#171717]">
                  ₹{Number(order.shipping_charge).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Tax
                </span>

                <span className="text-[#171717]">
                  ₹{Number(order.tax).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-[#ddd6ca] pt-4">
                <div className="flex justify-between text-[16px] font-semibold text-[#103f35]">
                  <span>Total</span>

                  <span>
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
