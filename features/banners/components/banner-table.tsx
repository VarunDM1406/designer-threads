"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { Banner } from "../types/banner";
import { deleteBanner } from "../actions/delete-banner";

type Props = {
  banners: Banner[];
};

export default function BannerTable({ banners }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredBanners = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return banners;

    return banners.filter((banner) => {
      return (
        banner.title?.toLowerCase().includes(query) ||
        banner.position.toLowerCase().includes(query)
      );
    });
  }, [banners, search]);

  async function handleDelete(
    id: string,
    title: string | null
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        title || "this banner"
      }"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteBanner(id);

      router.refresh();
    } catch (error) {
      console.error("DELETE BANNER ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete banner."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-2xl border bg-white">
      {/* Search */}
      <div className="border-b p-4">
        <input
          type="text"
          placeholder="Search banner or position..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                Banner
              </th>

              <th className="px-4 py-3 text-left">
                Position
              </th>

              <th className="px-4 py-3 text-left">
                Order
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBanners.map((banner) => (
              <tr
                key={banner.id}
                className="border-b"
              >
                {/* Banner */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={
                          banner.title ||
                          "Banner"
                        }
                        className="h-14 w-24 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-14 w-24 items-center justify-center rounded-lg text-[9px] font-medium uppercase tracking-wide text-white/80"
                        style={{
                          backgroundColor:
                            banner.background_color ||
                            "#103f35",
                        }}
                      >
                        Text
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">
                        {banner.title ||
                          "Untitled Banner"}
                      </p>

                      {banner.subtitle && (
                        <p className="text-xs text-gray-500">
                          {banner.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Position */}
                <td className="px-4 py-4 capitalize">
                  {banner.position}
                </td>

                {/* Display Order */}
                <td className="px-4 py-4">
                  {banner.display_order}
                </td>

                {/* Status */}
                <td className="px-4 py-4">
                  <span
                    className={
                      banner.is_active
                        ? "font-medium text-green-600"
                        : "font-medium text-red-600"
                    }
                  >
                    {banner.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/banners/${banner.id}/edit`}
                      className="rounded-lg border px-3 py-1.5"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={
                        deletingId === banner.id
                      }
                      onClick={() =>
                        handleDelete(
                          banner.id,
                          banner.title
                        )
                      }
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 disabled:opacity-50"
                    >
                      {deletingId === banner.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredBanners.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No banners found.
        </div>
      )}
    </div>
  );
}