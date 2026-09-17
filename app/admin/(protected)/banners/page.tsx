import Link from "next/link";

import PageHeader from "@/components/ui/page-header";
import BannerTable from "@/features/banners/components/banner-table";
import { getBanners } from "@/features/banners/actions/get-banners";

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <>
      <PageHeader
        title="Banners"
        description="Manage homepage and promotional banners."
      />

      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/banners/create"
          className="rounded-xl bg-black px-5 py-3 font-medium text-white"
        >
          Create Banner
        </Link>
      </div>

      <BannerTable banners={banners} />
    </>
  );
}