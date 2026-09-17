import PageHeader from "@/components/ui/page-header";
import CollectionForm from "@/features/collections/components/collection-form";

export default function NewCollectionPage() {
  return (
    <>
      <PageHeader
        title="Create Collection"
        description="Add a new collection."
      />

      <CollectionForm />
    </>
  );
}