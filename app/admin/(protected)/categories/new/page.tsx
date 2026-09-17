import PageHeader from "@/components/ui/page-header";
import CategoryForm from "@/features/categories/components/category-form";

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader
        title="Create Category"
        description="Add a new category."
      />

      <CategoryForm />
    </>
  );
}