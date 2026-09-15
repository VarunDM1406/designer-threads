import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { getProducts } from "../actions/get-products";
import DeleteProductButton from "./delete-product-button";
import { formatPrice } from "@/lib/format";

type ProductImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
};

function getThumbnail(images: ProductImage[] | null | undefined) {
  if (!images || images.length === 0) return null;

  const primary = images.find((img) => img.is_primary);
  if (primary) return primary.image_url;

  const sorted = [...images].sort(
    (a, b) => a.display_order - b.display_order
  );

  return sorted[0].image_url;
}

export default async function ProductTable() {
  const products = await getProducts();

  if (!products.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">No Products Found</h2>

        <p className="mt-2 text-gray-500">
          Create your first product to start selling.
        </p>

        <Link
          href="/admin/products/new"
          className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-white"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">Image</th>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">SKU</th>
            <th className="px-6 py-4 text-left">Price</th>
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product: any) => {
            const thumbnail = getThumbnail(product.product_images);

            return (
              <tr key={product.id} className="border-b last:border-none">
                <td className="px-6 py-4">
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-gray-50 text-gray-300">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 font-medium">{product.name}</td>

                <td className="px-6 py-4">{product.sku}</td>

                <td className="px-6 py-4">
                  {formatPrice(Number(product.price))}
                </td>

                <td className="px-6 py-4">{product.stock_quantity}</td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                    >
                      Edit
                    </Link>

                    <DeleteProductButton id={product.id} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}