import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/page-header";
import CategoryForm from "@/features/categories/components/category-form";

import { getCategory } from "@/features/categories/actions/get-categories";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryPage({
  params,
}: Props) {
  const { id } = await params;

  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Category"
        description="Update category details."
      />

      <CategoryForm initialData={category} />
    </>
  );
}