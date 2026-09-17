import { notFound } from "next/navigation";
import PageHeader from "@/components/ui/page-header";
import { getCustomer } from "@/features/customers/actions/get-customer";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  const name =
    `${customer.first_name ?? ""} ${customer.last_name ?? ""}`.trim() ||
    "Unnamed Customer";

  return (
    <>
      <PageHeader
        title={name}
        description="View customer details and order history."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold">
            Customer Information
          </h2>

          <div className="mt-5 space-y-4 text-sm">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium">{name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium">
                {customer.email || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium">
                {customer.phone || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Joined</p>
              <p className="font-medium">
                {new Date(customer.created_at).toLocaleDateString(
                  "en-IN"
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">
            Order History
          </h2>

          {customer.orders.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">
              No orders found.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customer.orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b"
                    >
                      <td className="px-4 py-4 font-medium">
  <a
    href={`/admin/orders/${order.id}`}
    className="hover:underline"
  >
    {order.order_number}
  </a>
</td>

                      <td className="px-4 py-4">
                        {new Date(
                          order.created_at
                        ).toLocaleDateString("en-IN")}
                      </td>

                      <td className="px-4 py-4">
                        ₹
                        {Number(order.total).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-4 py-4 capitalize">
                        {order.payment_status}
                      </td>

                      <td className="px-4 py-4 capitalize">
                        {order.order_status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}