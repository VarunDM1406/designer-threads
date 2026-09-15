import type { Order } from "../types/order";

type OrderSummaryProps = {
  order: Order;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrderSummary({
  order,
}: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border bg-white p-6">
      <h2 className="text-lg font-semibold">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span>{formatPrice(Number(order.subtotal))}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Discount</span>
          <span>
            -{formatPrice(Number(order.discount))}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span>{formatPrice(Number(order.shipping_charge))}</span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-semibold">
              {formatPrice(Number(order.total))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}