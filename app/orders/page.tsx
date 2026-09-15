import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function CustomerOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

        <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              My Orders
            </h1>

            <div className="mt-8 border border-[#ddd6ca] bg-white p-8">
              <p className="text-[13px] text-[#60716e]">
                Your customer profile could not be found.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const { data: orders, error } = await supabase
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
      created_at
    `)
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("MY ORDERS ERROR:", error);

    return (
      <>
        <Navbar />
        <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

        <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              My Orders
            </h1>

            <div className="mt-8 border border-[#ddd6ca] bg-white p-8">
              <p className="text-[13px] text-[#60716e]">
                Failed to load your orders.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-[#f4f0e8] px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-5xl">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Account
            </p>

            <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#103f35]">
              My Orders
            </h1>

            <p className="mt-2 text-[13px] text-[#60716e]">
              View your order history and track your purchases.
            </p>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="mt-8 border border-[#ddd6ca] bg-white p-10 text-center">
              <h2 className="font-serif text-xl text-[#103f35]">
                No orders yet
              </h2>

              <p className="mt-2 text-[13px] text-[#60716e]">
                You haven&apos;t placed any orders yet.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-block bg-[#103f35] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#ddd6ca] bg-white p-6"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
                        Order
                      </p>

                      <h2 className="mt-1 text-[15px] font-semibold text-[#171717]">
                        #{order.order_number}
                      </h2>

                      <p className="mt-1 text-[13px] text-[#60716e]">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-[15px] font-semibold text-[#171717]">
                        ₹
                        {Number(order.total).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2 sm:justify-end">
                        <span className="bg-[#f4f0e8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#103f35]">
                          {order.order_status}
                        </span>

                        <span className="bg-[#f4f0e8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#103f35]">
                          Payment: {order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-[#ddd6ca] pt-5">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-block bg-[#103f35] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
                    >
                      View Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
