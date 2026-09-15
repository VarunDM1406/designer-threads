import PageHeader from "@/components/ui/page-header";
import CategoryTable from "@/features/categories/components/category-table";

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage your product categories."
        actionLabel="Add Category"
        actionHref="/admin/categories/new"
      />

      <CategoryTable />
    </>
  );
}