import PageHeader from "@/components/ui/page-header";
import ProductTable from "@/features/products/components/product-table";

export default function ProductsPage() {
  return (
    <>
      <PageHeader
  title="Products"
  description="Manage your store products."
  actionLabel="Add Product"
  actionHref="/admin/products/new"
/>
      <ProductTable />
    </>
  );
}