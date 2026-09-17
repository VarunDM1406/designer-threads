import PageHeader from "@/components/ui/page-header";
import OrderTable from "@/features/orders/components/order-table";
import { getOrders } from "@/features/orders/actions/get-orders";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <>
      <PageHeader
        title="Orders"
        description="Manage customer orders, payments, and fulfillment."
      />

      <OrderTable orders={orders} />
    </>
  );
}