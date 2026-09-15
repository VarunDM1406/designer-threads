import Link from "next/link";

import { getCategories } from "../actions/get-categories";

export default async function CategoryTable() {
  const categories = await getCategories();

  if (!categories.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">
          No Categories Found
        </h2>

        <p className="mt-2 text-gray-500">
          Create your first category.
        </p>

        <Link
          href="/admin/categories/new"
          className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-white"
        >
          Add Category
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Slug</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category: any) => (
            <tr
              key={category.id}
              className="border-b last:border-none"
            >
              <td className="px-6 py-4 font-medium">
                {category.name}
              </td>

              <td className="px-6 py-4">
                {category.slug}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    category.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {category.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/categories/${category.id}`}
                  className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}