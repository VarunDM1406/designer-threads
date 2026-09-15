"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ImageUpload from "./image-upload";
import {
  productSchema,
  type ProductSchema,
} from "../schemas/product.schema";

import { createProduct } from "../actions/create-product";
import { updateProduct } from "../actions/update-product";
import { uploadProductImage } from "../actions/upload-product-image";

type ProductFormProps = {
  initialData?: Partial<ProductSchema> & { id?: string };

  categories: {
    id: string;
    name: string;
  }[];

  collections: {
    id: string;
    name: string;
  }[];

  images: {
    id: string;
    image_url: string;
    is_primary: boolean;
    display_order: number;
  }[];
};

export default function ProductForm({
  initialData,
  categories,
  collections,
  images,
}: ProductFormProps) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const [isPending, startTransition] = useTransition();

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    values: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      sku: initialData?.sku ?? "",

      category_id: initialData?.category_id ?? "",

      price: initialData?.price ?? 0,
      compare_at_price: initialData?.compare_at_price ?? undefined,
      collections:
        (initialData?.collections as unknown as { id: string }[])?.map(
          (c) => c.id
        ) ?? [],

      stock_quantity: initialData?.stock_quantity ?? 0,

      short_description: initialData?.short_description ?? "",

      description: initialData?.description ?? "",

      fabric: initialData?.fabric ?? "",

      care_instructions: initialData?.care_instructions ?? "",

      featured: initialData?.featured ?? false,

      new_arrival: initialData?.new_arrival ?? false,

      best_seller: initialData?.best_seller ?? false,

      is_active: initialData?.is_active ?? true,

      seo_title: initialData?.seo_title ?? "",

      seo_description: initialData?.seo_description ?? "",
    },
  });

  const onSubmit = (values: ProductSchema) => {
    setMessage("");
    setIsError(false);

    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateProduct(initialData!.id!, values)
          : await createProduct(values);

        setIsError(!result.success);

        if (result.success) {
          if (!isEditing && "productId" in result) {
            const newProductId = result.productId as string;

            // Upload any images the user staged before the product existed
            if (stagedFiles.length > 0) {
              setMessage(
                `Product created. Uploading ${stagedFiles.length} image(s)...`
              );

              for (const file of stagedFiles) {
                const formData = new FormData();
                formData.set("productId", newProductId);
                formData.set("file", file);

                const uploadResult = await uploadProductImage(formData);

                if (!uploadResult.success) {
                  console.error(uploadResult.message);
                }
              }
            }

            router.push(`/admin/products/${newProductId}`);
            return;
          }

          setMessage(result.message);
          router.refresh();
        } else {
          setMessage(result.message);
        }
      } catch (err) {
        console.error(err);
        setMessage(
          "Something went wrong while saving the product. Please try again."
        );
        setIsError(true);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            isError
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-green-300 bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Basic Information */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <p className="mb-6 text-sm text-gray-500">
          General details about the product.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <input
              {...register("name")}
              placeholder="Premium Cotton Shirt"
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Slug</label>

            <input
              {...register("slug")}
              placeholder="premium-cotton-shirt"
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.slug && (
              <p className="mt-1 text-sm text-red-500">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">SKU</label>

            <input
              {...register("sku")}
              placeholder="DTS-001"
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.sku && (
              <p className="mt-1 text-sm text-red-500">
                {errors.sku.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Organization</h2>

        <p className="mb-6 text-sm text-gray-500">
          Organize this product into categories and collections.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              {...register("category_id")}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">Select a category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {errors.category_id && (
              <p className="mt-1 text-sm text-red-500">
                {errors.category_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Collections
            </label>

            <Controller
              control={control}
              name="collections"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
                  {collections.map((collection) => {
                    const checked = field.value?.includes(collection.id);

                    return (
                      <label
                        key={collection.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const current = field.value ?? [];

                            if (e.target.checked) {
                              field.onChange([...current, collection.id]);
                            } else {
                              field.onChange(
                                current.filter(
                                  (id: string) => id !== collection.id
                                )
                              );
                            }
                          }}
                        />

                        {collection.name}
                      </label>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Pricing</h2>

        <p className="mb-6 text-sm text-gray-500">
          Configure the selling price of this product.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Price</label>

            <input
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Compare at Price
            </label>

            <input
              type="number"
              step="0.01"
              {...register("compare_at_price", { valueAsNumber: true })}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Inventory */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Inventory</h2>

        <p className="mb-6 text-sm text-gray-500">
          Manage inventory and stock levels.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock Quantity
            </label>

            <input
              type="number"
              {...register("stock_quantity", { valueAsNumber: true })}
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.stock_quantity && (
              <p className="mt-1 text-sm text-red-500">
                {errors.stock_quantity.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Images */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Product Images</h2>

        <p className="mb-6 text-sm text-gray-500">
          Upload and manage product images.
        </p>

        <ImageUpload
          productId={initialData?.id}
          initialImages={images}
          onStagedFilesChange={setStagedFiles}
        />
      </div>

      {/* Description */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Description</h2>

        <p className="mb-6 text-sm text-gray-500">
          Add detailed information about the product.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Short Description
            </label>

            <textarea
              {...register("short_description")}
              rows={3}
              placeholder="A short summary shown on product cards."
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.short_description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.short_description.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Full Description
            </label>

            <textarea
              {...register("description")}
              rows={6}
              placeholder="Write a detailed description..."
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Fabric
              </label>

              <input
                {...register("fabric")}
                placeholder="100% Cotton"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Care Instructions
              </label>

              <input
                {...register("care_instructions")}
                placeholder="Machine wash cold"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Visibility */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Visibility</h2>

        <p className="mb-6 text-sm text-gray-500">
          Control how this product appears in your store.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3 rounded-lg border p-4">
            <input type="checkbox" {...register("featured")} />
            <div>
              <p className="font-medium">Featured Product</p>
              <p className="text-sm text-gray-500">
                Show on homepage and featured sections.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-lg border p-4">
            <input type="checkbox" {...register("new_arrival")} />
            <div>
              <p className="font-medium">New Arrival</p>
              <p className="text-sm text-gray-500">
                Display in the new arrivals collection.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-lg border p-4">
            <input type="checkbox" {...register("best_seller")} />
            <div>
              <p className="font-medium">Best Seller</p>
              <p className="text-sm text-gray-500">
                Highlight as a bestselling product.
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 rounded-lg border p-4">
            <input type="checkbox" {...register("is_active")} />
            <div>
              <p className="font-medium">Published</p>
              <p className="text-sm text-gray-500">
                Make this product visible in the storefront.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* SEO */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">SEO</h2>

        <p className="mb-6 text-sm text-gray-500">
          Optimize this product for search engines.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              SEO Title
            </label>

            <input
              {...register("seo_title")}
              placeholder="Premium Cotton Shirt | Designer Threads"
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.seo_title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.seo_title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              SEO Description
            </label>

            <textarea
              {...register("seo_description")}
              rows={4}
              placeholder="A concise description for search engines."
              className="w-full rounded-lg border px-4 py-3"
            />

            {errors.seo_description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.seo_description.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-black px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Create Product"}
        </button>
      </div>
    </form>
  );
}