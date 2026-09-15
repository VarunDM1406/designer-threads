"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

import { uploadCollectionImage } from "../actions/upload-collection-image";

type CollectionImageFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export default function CollectionImageField({
  label,
  value,
  onChange,
}: CollectionImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleFile(file: File | undefined) {
    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);

      const result = await uploadCollectionImage(formData);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        setError(result.message || "Failed to upload image.");
      }
    });
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label}
      </label>

      {value ? (
        <div className="group relative overflow-hidden rounded-lg border">
          <img
            src={value}
            alt=""
            className="h-44 w-full object-cover"
          />

          <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              className="rounded-full bg-black/70 p-1.5 text-white"
              aria-label="Replace image"
              title="Replace image"
            >
              <Upload className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onChange("")}
              disabled={isPending}
              className="rounded-full bg-black/70 p-1.5 text-white"
              aria-label="Remove image"
              title="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 text-sm text-gray-500 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          {isPending ? "Uploading..." : "Click to upload an image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
