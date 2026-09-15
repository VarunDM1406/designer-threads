"use client";

type ImageType = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

type ImageGalleryProps = {
  images: ImageType[];
  onDelete: (id: string) => void;
  onPrimary: (id: string) => void;
};

export default function ImageGallery({
  images,
  onDelete,
  onPrimary,
}: ImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="overflow-hidden rounded-xl border bg-white"
        >
          <img
            src={image.image_url}
            alt=""
            className="h-48 w-full object-cover"
          />

          <div className="flex items-center justify-between p-3">
            <button
              type="button"
              onClick={() => onPrimary(image.id)}
              className={`rounded px-3 py-1 text-sm ${
                image.is_primary
                  ? "bg-green-600 text-white"
                  : "border"
              }`}
            >
              {image.is_primary
                ? "Primary"
                : "Set Primary"}
            </button>

            <button
              type="button"
              onClick={() => onDelete(image.id)}
              className="rounded bg-red-600 px-3 py-1 text-sm text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}