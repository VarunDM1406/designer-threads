import PageHeader from "@/components/ui/page-header";
import CollectionTable from "@/features/collections/components/collection-table";

export default function CollectionsPage() {
  return (
    <>
      <PageHeader
        title="Collections"
        description="Manage your collections."
        actionLabel="Add Collection"
        actionHref="/admin/collections/new"
      />

      <CollectionTable />
    </>
  );
}