import PageHeader from "@/components/ui/page-header";
import CreateBannerForm from "@/features/banners/components/create-banner-form";

export default function CreateBannerPage() {
  return (
    <>
      <PageHeader
        title="Create Banner"
        description="Create a homepage or promotional banner."
      />

      <CreateBannerForm />
    </>
  );
}