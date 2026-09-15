"use client";

import Link from "next/link";
import { Search, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  Order,
  OrderStatus,
  PaymentStatus,
} from "../types/order";

import OrderStatusBadge from "./order-status-badge";
import PaymentStatusBadge from "./payment-status-badge";
import DeleteOrderButton from "./delete-order-button";

type Props = {
  orders: Order[];
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

const orderStatuses: {
  label: string;
  value: OrderStatus | "all";
}[] = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const paymentStatuses: {
  label: string;
  value: PaymentStatus | "all";
}[] = [
  { label: "All Payments", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export default function OrderTable({
  orders,
}: Props) {
  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<OrderStatus | "all">("all");
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus | "all">("all");

  const filteredOrders = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !searchValue ||
        order.order_number
          .toLowerCase()
          .includes(searchValue) ||
        order.customer_name
          .toLowerCase()
          .includes(searchValue) ||
        order.customer_phone
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        status === "all" || order.status === status;

      const matchesPayment =
        paymentStatus === "all" ||
        order.payment_status === paymentStatus;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [orders, search, status, paymentStatus]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-2xl border bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search order, customer or phone..."
              className="h-11 w-full rounded-xl border bg-white pl-10 pr-10 text-sm outline-none transition focus:border-black"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Order status */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as OrderStatus | "all"
              )
            }
            className="h-11 rounded-xl border bg-white px-4 text-sm outline-none focus:border-black"
          >
            {orderStatuses.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>

          {/* Payment */}
          <select
            value={paymentStatus}
            onChange={(e) =>
              setPaymentStatus(
                e.target.value as PaymentStatus | "all"
              )
            }
            className="h-11 rounded-xl border bg-white px-4 text-sm outline-none focus:border-black"
          >
            {paymentStatuses.map((item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {filteredOrders.length}
          </span>{" "}
          {filteredOrders.length === 1
            ? "order"
            : "orders"}
        </p>
      </div>

      {/* Empty state */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag className="h-6 w-6 text-gray-400" />
          </div>

          <h2 className="mt-4 text-xl font-semibold">
            No Orders Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Total
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors last:border-none hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold hover:underline"
                      >
                        #{order.order_number}
                      </Link>

                      <p className="mt-1 text-xs text-gray-500">
                        {order.order_items?.length ?? 0}{" "}
                        {(order.order_items?.length ?? 0) ===
                        1
                          ? "item"
                          : "items"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">
                        {order.customer_name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {order.customer_phone}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      {formatPrice(Number(order.total))}
                    </td>

                    <td className="px-6 py-4">
                      <PaymentStatusBadge
                        status={order.payment_status}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <OrderStatusBadge
                        status={order.status}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-gray-100"
                        >
                          View
                        </Link>

                        <DeleteOrderButton
                          id={order.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}