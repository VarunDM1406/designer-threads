import Link from "next/link";

import { getCollections } from "../actions/get-collections";

export default async function CollectionTable() {
  const collections = await getCollections();

  if (!collections.length) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h2 className="text-xl font-semibold">
          No Collections Found
        </h2>

        <p className="mt-2 text-gray-500">
          Create your first collection.
        </p>

        <Link
          href="/admin/collections/new"
          className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-white"
        >
          Add Collection
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
            <th className="px-6 py-4 text-left">Slug</th>
            <th className="px-6 py-4 text-left">Featured</th>
            <th className="px-6 py-4 text-left">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {collections.map((collection: any) => (
            <tr
              key={collection.id}
              className="border-b last:border-none"
            >
              <td className="px-6 py-4">
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                  {collection.thumbnail_image_url ||
                  collection.banner_image_url ? (
                    <img
                      src={
                        collection.thumbnail_image_url ||
                        collection.banner_image_url
                      }
                      alt={collection.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-gray-400">
                      No image
                    </div>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 font-medium">
                {collection.name}
              </td>

              <td className="px-6 py-4">
                {collection.slug}
              </td>

              <td className="px-6 py-4">
                {collection.is_featured
                  ? "Yes"
                  : "No"}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    collection.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {collection.is_active
                    ? "Active"
                    : "Inactive"}
                </span>
              </td>

              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/collections/${collection.id}`}
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