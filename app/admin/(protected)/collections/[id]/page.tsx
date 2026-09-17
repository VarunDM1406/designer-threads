import { notFound } from "next/navigation";

import PageHeader from "@/components/ui/page-header";
import CollectionForm from "@/features/collections/components/collection-form";

import { getCollection } from "@/features/collections/actions/get-collections";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCollectionPage({
  params,
}: Props) {
  const { id } = await params;

  const collection = await getCollection(id);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Collection"
        description="Update collection details."
      />

      <CollectionForm initialData={collection} />
    </>
  );
}