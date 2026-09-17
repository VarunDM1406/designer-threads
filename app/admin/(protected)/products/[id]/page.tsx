import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/page-header";
import ProductForm from "@/features/products/components/product-form";

import { getProduct } from "@/features/products/actions/get-products";
import { getCategoryOptions } from "@/features/categories/actions/get-category-options";
import { getCollections } from "@/features/collections/actions/get-collections";
import { getProductImages } from "@/features/products/actions/get-product-images";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: Props) {
  const { id } = await params;

  const [product, categories, collections, images] =
  await Promise.all([
    getProduct(id),
    getCategoryOptions(),
    getCollections(),
    getProductImages(id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Product"
        description="Update your product details."
      />

      <ProductForm
        initialData={product}
        categories={categories}
        collections={collections}
        images={images}
      />
    </>
  );
}