import Link from "next/link";
import PageHeader from "@/components/ui/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: customers },
    { count: products },
    { count: orders },
    { data: orderData },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("orders")
      .select("total"),

    supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        total,
        order_status,
        payment_status,
        created_at
        `
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const revenue =
    orderData?.reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    ) ?? 0;

  const stats = [
    {
      label: "Total Customers",
      value: customers ?? 0,
    },
    {
      label: "Total Products",
      value: products ?? 0,
    },
    {
      label: "Total Orders",
      value: orders ?? 0,
    },
    {
      label: "Total Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back 👋"
      />

      {/* Overview */}
      <section>
        <h2 className="text-2xl font-semibold">
          Overview
        </h2>

        <p className="mt-1 text-neutral-500">
          Business performance at a glance.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border bg-white p-6"
            >
              <p className="text-sm text-neutral-500">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <section className="rounded-2xl border bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Recent Orders
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Latest customer orders.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  Order
                </th>

                <th className="px-6 py-3 text-left">
                  Amount
                </th>

                <th className="px-6 py-3 text-left">
                  Status
                </th>

                <th className="px-6 py-3 text-left">
                  Payment
                </th>

                <th className="px-6 py-3 text-left">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders?.map((order) => (
                <tr
                  key={order.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-6 py-4 font-medium">
                    #{order.order_number}
                  </td>

                  <td className="px-6 py-4">
                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {order.order_status}
                  </td>

                  <td className="px-6 py-4 capitalize">
                    {order.payment_status}
                  </td>

                  <td className="px-6 py-4">
                    {new Date(
                      order.created_at
                    ).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!recentOrders ||
          recentOrders.length === 0) && (
          <div className="p-8 text-center text-neutral-500">
            No orders yet.
          </div>
        )}
      </section>

      {/* Revenue */}
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">
          Revenue Overview
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          Total revenue generated from orders.
        </p>

        <p className="mt-6 text-4xl font-bold">
          ₹{revenue.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          Across {orders ?? 0} total orders
        </p>
      </section>
    </div>
  );
}