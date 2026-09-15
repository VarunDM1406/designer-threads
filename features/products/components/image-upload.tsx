"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Star, Trash2, Loader2 } from "lucide-react";
import { uploadProductImage } from "../actions/upload-product-image";
import { deleteProductImage } from "../actions/delete-product-image";
import { setPrimaryImage } from "../actions/set-primary-image";

type ProductImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
};

type ImageUploadProps = {
  productId?: string;

  initialImages: ProductImage[];

  // Used only when productId is not yet available (Add Product flow).
  // Called with the current staged File list every time it changes, so
  // the parent form can upload them right after the product is created.
  onStagedFilesChange?: (files: File[]) => void;
};

export default function ImageUpload({
  productId,
  initialImages,
  onStagedFilesChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState(initialImages);
  const [error, setError] = useState("");

  // Staged mode: used before a product exists (Add Product page)
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [stagedPreviews, setStagedPreviews] = useState<string[]>([]);

  const isStagedMode = !productId;

  useEffect(() => {
    // Clean up object URLs when component unmounts or files change
    return () => {
      stagedPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stagedPreviews]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError("");

    const fileArray = Array.from(files);

    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError(`"${file.name}" is not an image file.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" exceeds the 5MB size limit.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (isStagedMode) {
      const newFiles = [...stagedFiles, ...validFiles];
      const newPreviews = [
        ...stagedPreviews,
        ...validFiles.map((f) => URL.createObjectURL(f)),
      ];

      setStagedFiles(newFiles);
      setStagedPreviews(newPreviews);
      onStagedFilesChange?.(newFiles);
      return;
    }

    startTransition(async () => {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.set("productId", productId!);
        formData.set("file", file);

        const result = await uploadProductImage(formData);

        if (result.success && result.image) {
          setImages((prev) => [...prev, result.image as ProductImage]);
        } else {
          setError(result.message || "Failed to upload image.");
        }
      }
    });
  };

  const handleRemoveStaged = (index: number) => {
    URL.revokeObjectURL(stagedPreviews[index]);

    const newFiles = stagedFiles.filter((_, i) => i !== index);
    const newPreviews = stagedPreviews.filter((_, i) => i !== index);

    setStagedFiles(newFiles);
    setStagedPreviews(newPreviews);
    onStagedFilesChange?.(newFiles);
  };

  const handleDelete = (imageId: string) => {
    setError("");

    startTransition(async () => {
      const result = await deleteProductImage(imageId);

      if (result.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } else {
        setError(result.message || "Failed to delete image.");
      }
    });
  };

  const handleSetPrimary = (imageId: string) => {
    if (!productId) return;

    setError("");

    startTransition(async () => {
      const result = await setPrimaryImage(productId, imageId);

      if (result.success) {
        setImages((prev) =>
          prev.map((img) => ({
            ...img,
            is_primary: img.id === imageId,
          }))
        );
      } else {
        setError(result.message || "Failed to set primary image.");
      }
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="rounded-lg border-2 border-dashed border-gray-300 p-10 text-center"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />

        <p className="text-lg font-medium">Upload Product Images</p>

        <p className="mt-2 text-sm text-gray-500">
          Drag & drop images here or click below.
        </p>

        {isStagedMode && (
          <p className="mt-1 text-xs text-amber-600">
            Images will be uploaded once you save the product below.
          </p>
        )}

        <button
          type="button"
          disabled={isPending}
          onClick={() => inputRef.current?.click()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-white disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? "Uploading..." : "Choose Images"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}

      {/* Staged previews (Add Product, before save) */}
      {isStagedMode && stagedPreviews.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stagedPreviews.map((url, index) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-lg border"
            >
              <img
                src={url}
                alt=""
                className="h-40 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => handleRemoveStaged(index)}
                className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded images (Edit Product) */}
      {!isStagedMode && images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border"
            >
              <img
                src={image.image_url}
                alt=""
                className="h-40 w-full object-cover"
              />

              {image.is_primary && (
                <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black px-2 py-1 text-xs text-white">
                  <Star className="h-3 w-3 fill-white" />
                  Primary
                </span>
              )}

              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {!image.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(image.id)}
                    className="rounded-full bg-black/70 p-1.5 text-white"
                    aria-label="Set as primary"
                    title="Set as primary"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  className="rounded-full bg-black/70 p-1.5 text-white"
                  aria-label="Delete image"
                  title="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}