"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteOrder } from "../actions/delete-order";

type DeleteOrderButtonProps = {
  id: string;
};

export default function DeleteOrderButton({
  id,
}: DeleteOrderButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");

    startTransition(async () => {
      try {
        const result = await deleteOrder(id);

        if (!result.success) {
          setError(result.message);
          return;
        }

        window.location.reload();
      } catch (error) {
        console.error(error);
        setError("Failed to delete order.");
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        aria-label="Delete order"
        className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {error && (
        <p className="max-w-40 text-right text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}