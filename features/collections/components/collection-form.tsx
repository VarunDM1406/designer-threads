"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  collectionSchema,
  type CollectionSchema,
} from "../schemas/collection.schema";

import { createCollection } from "../actions/create-collection";
import { updateCollection } from "../actions/update-collection";
import CollectionImageField from "./collection-image-field";

type Props = {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    banner_image_url: string | null;
    thumbnail_image_url: string | null;
    is_featured: boolean;
    is_active: boolean;
  };
};

export default function CollectionForm({
  initialData,
}: Props) {
  const router = useRouter();

  const [message, setMessage] = useState("");

  const [isPending, startTransition] =
    useTransition();

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CollectionSchema>({
    resolver: zodResolver(collectionSchema),

    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description:
        initialData?.description ?? "",
      banner_image_url:
        initialData?.banner_image_url ?? "",
      thumbnail_image_url:
        initialData?.thumbnail_image_url ?? "",
      is_featured:
        initialData?.is_featured ?? false,
      is_active:
        initialData?.is_active ?? true,
    },
  });

  const bannerImageUrl = watch("banner_image_url") ?? "";
  const thumbnailImageUrl = watch("thumbnail_image_url") ?? "";

  function onSubmit(values: CollectionSchema) {
    setMessage("");

    startTransition(async () => {
      const result = isEditing
        ? await updateCollection(
            initialData.id,
            values
          )
        : await createCollection(values);

      setMessage(result.message);

      if (result.success) {
        router.push("/admin/collections");
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border bg-white p-8 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-medium">
          Name
        </label>

        <input
          {...register("name")}
          className="w-full rounded-lg border px-4 py-3"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Slug
        </label>

        <input
          {...register("slug")}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-lg border px-4 py-3"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <CollectionImageField
          label="Banner Image"
          value={bannerImageUrl}
          onChange={(url) =>
            setValue("banner_image_url", url, {
              shouldDirty: true,
            })
          }
        />

        <CollectionImageField
          label="Thumbnail Image"
          value={thumbnailImageUrl}
          onChange={(url) =>
            setValue("thumbnail_image_url", url, {
              shouldDirty: true,
            })
          }
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_featured")}
          />
          Featured
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("is_active")}
          />
          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        {isPending
          ? "Saving..."
          : isEditing
          ? "Update Collection"
          : "Create Collection"}
      </button>

      {message && (
        <p className="text-green-600">
          {message}
        </p>
      )}
    </form>
  );
}
