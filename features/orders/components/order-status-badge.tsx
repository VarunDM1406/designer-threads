import type { OrderStatus } from "../types/order";

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusStyles: Record<OrderStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-700",
  confirmed:
    "bg-blue-100 text-blue-700",
  processing:
    "bg-purple-100 text-purple-700",
  shipped:
    "bg-indigo-100 text-indigo-700",
  delivered:
    "bg-green-100 text-green-700",
  cancelled:
    "bg-red-100 text-red-700",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}