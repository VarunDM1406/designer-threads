"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "../actions/delete-product";

type Props = {
  id: string;
};

export default function DeleteProductButton({
  id,
}: Props) {
  const router = useRouter();

  const [pending, startTransition] =
    useTransition();

  const onDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result =
        await deleteProduct(id);

      if (result.success) {
        router.refresh();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}