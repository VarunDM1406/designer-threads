import PageHeader from "@/components/ui/page-header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BannerPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: banner, error } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !banner) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title={banner.title || "Banner"}
        description="View banner details and settings."
      />

      <div className="max-w-4xl rounded-2xl border bg-white p-6">
        <div className="mb-6 flex justify-end gap-2">
          <Link
            href={`/admin/banners/${banner.id}/edit`}
            className="rounded-lg border px-4 py-2"
          >
            Edit
          </Link>

          <Link
            href="/admin/banners"
            className="rounded-lg border px-4 py-2"
          >
            Back
          </Link>
        </div>

        {banner.image_url ? (
          <div className="mb-6 overflow-hidden rounded-xl border">
            <img
              src={banner.image_url}
              alt={banner.title || "Banner"}
              className="max-h-[400px] w-full object-cover"
            />
          </div>
        ) : (
          banner.background_color && (
            <div
              className="mb-6 flex h-[160px] items-center justify-center rounded-xl border text-xs font-medium uppercase tracking-wide text-white/80"
              style={{
                backgroundColor: banner.background_color,
              }}
            >
              Text-only banner — {banner.background_color}
            </div>
          )
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">
              Title
            </p>
            <p className="font-medium">
              {banner.title || "None"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Position
            </p>
            <p className="font-medium capitalize">
              {banner.position}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Subtitle
            </p>
            <p className="font-medium">
              {banner.subtitle || "None"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Display Order
            </p>
            <p className="font-medium">
              {banner.display_order}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Button
            </p>
            <p className="font-medium">
              {banner.button_text || "None"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Button Link
            </p>
            <p className="font-medium">
              {banner.button_link || "None"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Starts At
            </p>
            <p className="font-medium">
              {banner.starts_at
                ? new Date(
                    banner.starts_at
                  ).toLocaleString("en-IN")
                : "No start date"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Ends At
            </p>
            <p className="font-medium">
              {banner.ends_at
                ? new Date(
                    banner.ends_at
                  ).toLocaleString("en-IN")
                : "No expiry"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <p
              className={
                banner.is_active
                  ? "font-medium text-green-600"
                  : "font-medium text-red-600"
              }
            >
              {banner.is_active
                ? "Active"
                : "Inactive"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Created
            </p>
            <p className="font-medium">
              {new Date(
                banner.created_at
              ).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}