import PageHeader from "@/components/ui/page-header";
import CustomerTable from "@/features/customers/components/customer-table";
import { getCustomers } from "@/features/customers/actions/get-customers";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <>
      <PageHeader
        title="Customers"
        description="Manage registered customers and their orders."
      />

      <CustomerTable customers={customers} />
    </>
  );
}