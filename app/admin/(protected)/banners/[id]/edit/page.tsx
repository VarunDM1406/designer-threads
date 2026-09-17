import PageHeader from "@/components/ui/page-header";
import EditBannerForm from "@/features/banners/components/edit-banner-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBannerPage({
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
        title="Edit Banner"
        description="Update banner details and settings."
      />

      <EditBannerForm banner={banner} />
    </>
  );
}