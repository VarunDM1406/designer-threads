import PageHeader from "@/components/ui/page-header";
import ProductForm from "@/features/products/components/product-form";

import { getCategoryOptions } from "@/features/categories/actions/get-category-options";
import { getCollections } from "@/features/collections/actions/get-collections";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    getCategoryOptions(),
    getCollections(),
  ]);

  return (
    <>
      <PageHeader
        title="Create Product"
        description="Add a new product to your catalogue."
      />

      <ProductForm
        categories={categories}
        collections={collections} images={[]}      />
    </>
  );
}