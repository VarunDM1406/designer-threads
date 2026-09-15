"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  categorySchema,
  type CategorySchema,
} from "../schemas/category.schema";

import { createCategory } from "../actions/create-category";
import { updateCategory } from "../actions/update-category";

type Props = {
  initialData?: any;
};

export default function CategoryForm({
  initialData,
}: Props) {
  const router = useRouter();

  const [message, setMessage] = useState("");

  const [pending, startTransition] =
    useTransition();

  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),

    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description:
        initialData?.description ?? "",
      image_url:
        initialData?.image_url ?? "",
      is_active:
        initialData?.is_active ?? true,
    },
  });

  function onSubmit(values: CategorySchema) {
    setMessage("");

    startTransition(async () => {
      const result = isEditing
        ? await updateCategory(
            initialData.id,
            values
          )
        : await createCategory(values);

      setMessage(result.message);

      if (result.success) {
        router.push("/admin/categories");
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border bg-white p-8"
    >
      <div>
        <label>Name</label>

        <input
          {...register("name")}
          className="mt-2 w-full rounded-lg border p-3"
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label>Slug</label>

        <input
          {...register("slug")}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label>Description</label>

        <textarea
          {...register("description")}
          rows={4}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label>Image URL</label>

        <input
          {...register("image_url")}
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-black px-6 py-3 text-white"
      >
        {pending
          ? "Saving..."
          : isEditing
          ? "Update Category"
          : "Create Category"}
      </button>

      {message && (
        <p className="text-green-600">
          {message}
        </p>
      )}
    </form>
  );
}