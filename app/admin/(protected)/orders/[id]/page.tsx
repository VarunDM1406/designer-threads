import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/page-header";
import { getOrder } from "@/features/orders/actions/get-order";
import OrderSummary from "@/features/orders/components/order-summary";
import OrderStatusBadge from "@/features/orders/components/order-status-badge";
import PaymentStatusBadge from "@/features/orders/components/payment-status-badge";
import OrderStatusSelect from "@/features/orders/components/order-status-select";
import PaymentStatusSelect from "@/features/orders/components/payment-status-select";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const order = await getOrder(id);

  if (!order) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={`Order #${order.order_number}`}
        description="View and manage order details."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Customer */}
<div className="rounded-2xl border bg-white p-6">
  <h2 className="text-lg font-semibold">
    Customer
  </h2>

  <div className="mt-4 space-y-2 text-sm">
    <p>
      <span className="text-gray-500">Name:</span>{" "}
      {order.profile
        ? `${order.profile.first_name ?? ""} ${
            order.profile.last_name ?? ""
          }`.trim() || "Not provided"
        : "Not available"}
    </p>

    <p>
      <span className="text-gray-500">Phone:</span>{" "}
      {order.profile?.phone || "Not provided"}
    </p>

    <p>
      <span className="text-gray-500">Email:</span>{" "}
      {order.profile?.email || "Not provided"}
    </p>
  </div>
</div>
{/* Shipping Address */}
<div className="rounded-2xl border bg-white p-6">
  <h2 className="text-lg font-semibold">
    Shipping Address
  </h2>

  {order.shipping_address ? (
    <div className="mt-4 space-y-1 text-sm text-gray-600">
      <p className="font-medium text-gray-900">
        {order.shipping_address.full_name}
      </p>

      <p>
        {order.shipping_address.address_line_1}
      </p>

      <p>
        {order.shipping_address.city},{" "}
        {order.shipping_address.state}
      </p>

      <p>
        {order.shipping_address.postal_code}
      </p>

      <p>
        {order.shipping_address.country}
      </p>

      {order.shipping_address.phone && (
        <p className="pt-2">
          Phone: {order.shipping_address.phone}
        </p>
      )}
    </div>
  ) : (
    <p className="mt-4 text-sm text-gray-500">
      No shipping address available.
    </p>
  )}
</div>
          {/* Items */}
          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">
              Order Items
            </h2>

            <div className="mt-6 divide-y">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.product_name}
                    </p>

                    <p className="text-sm text-gray-500">
  SKU: {item.product_sku}
</p>

{item.size && (
  <p className="text-sm text-gray-500">
    Size: {item.size}
  </p>
)}

{item.color && (
  <p className="text-sm text-gray-500">
    Color: {item.color}
  </p>
)}

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    ₹{Number(item.total_price).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Notes
              </h2>

              <p className="mt-3 text-sm text-gray-600">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Status */}
<div className="rounded-2xl border bg-white p-6">
  <h2 className="text-lg font-semibold">
    Order Status
  </h2>

  <div className="mt-5 space-y-5">
    <div>
      <p className="mb-2 text-sm text-gray-500">
        Order Status
      </p>

      <OrderStatusSelect
        orderId={order.id}
        currentStatus={order.status}
      />
    </div>

    <div>
      <p className="mb-2 text-sm text-gray-500">
        Payment Status
      </p>

      <PaymentStatusSelect
        orderId={order.id}
        currentStatus={order.payment_status}
      />
    </div>
  </div>
</div>

          {/* Summary */}
<OrderSummary order={order} />

{/* Fulfillment */}
<div className="rounded-2xl border bg-white p-6">
  <h2 className="text-lg font-semibold">
    Fulfillment
  </h2>

  <div className="mt-5 space-y-4">
    <div>
      <p className="text-sm text-gray-500">
        Tracking Number
      </p>

      <p className="mt-1 font-medium">
        {order.tracking_number || "Not assigned"}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500">
        Payment Method
      </p>

      <p className="mt-1 font-medium">
        {order.payment_method || "Not specified"}
      </p>
    </div>
  </div>
</div>

        </div>
      </div>
    </>
  );
}