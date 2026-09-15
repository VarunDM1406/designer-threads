"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadBannerImage } from "../actions/upload-banner-image";
import { createBanner } from "../actions/create-banner";

type BannerPosition =
  | "hero"
  | "announcement"
  | "collection"
  | "promotion";

export default function CreateBannerForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");

  const [imagePreview, setImagePreview] = useState("");
  const [mobileImagePreview, setMobileImagePreview] =
    useState("");

  const [textOnly, setTextOnly] = useState(false);
  const [backgroundColor, setBackgroundColor] =
    useState("#103f35");

  const [position, setPosition] =
    useState<BannerPosition>("hero");

  const [displayOrder, setDisplayOrder] = useState("0");

  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [uploadingDesktop, setUploadingDesktop] =
    useState(false);

  const [uploadingMobile, setUploadingMobile] =
    useState(false);

  const [loading, setLoading] = useState(false);

  async function uploadImage(
    file: File,
    type: "desktop" | "mobile"
  ) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "desktop") {
      setImagePreview(previewUrl);
      setUploadingDesktop(true);
    } else {
      setMobileImagePreview(previewUrl);
      setUploadingMobile(true);
    }

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("type", type);

      const result = await uploadBannerImage(formData);

      if (!result.success || !result.url) {
        throw new Error(
          result.message || "Failed to upload image."
        );
      }

      if (type === "desktop") {
        setImageUrl(result.url);
      } else {
        setMobileImageUrl(result.url);
      }
    } catch (error) {
      console.error("BANNER UPLOAD ERROR:", error);

      if (type === "desktop") {
        setImagePreview("");
        setImageUrl("");
      } else {
        setMobileImagePreview("");
        setMobileImageUrl("");
      }

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      if (type === "desktop") {
        setUploadingDesktop(false);
      } else {
        setUploadingMobile(false);
      }
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const isTextOnlyHero = position === "hero" && textOnly;

    if (!isTextOnlyHero && !imageUrl) {
      alert("Please upload the desktop banner image.");
      return;
    }

    if (uploadingDesktop || uploadingMobile) {
      alert("Please wait for the image upload to finish.");
      return;
    }

    if (endsAt && startsAt) {
      if (
        new Date(endsAt) <= new Date(startsAt)
      ) {
        alert("End date must be after start date.");
        return;
      }
    }

    try {
      setLoading(true);

      await createBanner({
        title: title.trim() || null,
        subtitle: subtitle.trim() || null,

        button_text:
          buttonText.trim() || null,

        button_link:
          buttonLink.trim() || null,

        image_url: isTextOnlyHero ? null : imageUrl,

        mobile_image_url: isTextOnlyHero
          ? null
          : mobileImageUrl || null,

        background_color: isTextOnlyHero
          ? backgroundColor
          : null,

        position,

        display_order:
          Number(displayOrder) || 0,

        starts_at: startsAt
          ? new Date(startsAt).toISOString()
          : null,

        ends_at: endsAt
          ? new Date(endsAt).toISOString()
          : null,

        is_active: isActive,
      });

      router.push("/admin/banners");
      router.refresh();
    } catch (error) {
      console.error("CREATE BANNER ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to create banner."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-2xl border bg-white p-6"
    >
      <div className="space-y-6">

        {/* TITLE */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summer Collection"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* SUBTITLE */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Subtitle
          </label>

          <textarea
            value={subtitle}
            onChange={(e) =>
              setSubtitle(e.target.value)
            }
            placeholder="Discover our latest collection"
            rows={3}
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* TEXT-ONLY HERO BANNER */}
        {position === "hero" && (
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={textOnly}
              onChange={(e) =>
                setTextOnly(e.target.checked)
              }
              className="h-4 w-4"
            />

            <span className="text-sm font-medium">
              Text-only banner (no image, solid background
              color instead)
            </span>
          </label>
        )}

        {/* BACKGROUND COLOR */}
        {position === "hero" && textOnly && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Background Color
            </label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) =>
                  setBackgroundColor(e.target.value)
                }
                className="h-11 w-14 cursor-pointer rounded-lg border"
              />

              <input
                type="text"
                value={backgroundColor}
                onChange={(e) =>
                  setBackgroundColor(e.target.value)
                }
                placeholder="#103f35"
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>
          </div>
        )}

        {/* DESKTOP IMAGE */}
        {!(position === "hero" && textOnly) && (
        <>
        <div>
          <label className="mb-2 block text-sm font-medium">
            Desktop Banner
          </label>

          <p className="mb-3 text-xs text-neutral-500">
            Recommended: 1920 × 700 px · JPG, PNG or WebP ·
            Max 5MB
          </p>

          <input
            id="desktop-banner"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                uploadImage(file, "desktop");
              }
            }}
          />

          <label
            htmlFor="desktop-banner"
            className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 p-8 text-center hover:bg-neutral-50"
          >
            {uploadingDesktop
              ? "Uploading..."
              : imagePreview
                ? "Change Desktop Image"
                : "Choose Desktop Image"}
          </label>

          {imagePreview && (
            <div className="mt-4 overflow-hidden rounded-xl border">
              <img
                src={imagePreview}
                alt="Desktop banner preview"
                className="h-48 w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* MOBILE IMAGE */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Mobile Banner
          </label>

          <p className="mb-3 text-xs text-neutral-500">
            Optional · Recommended: 1080 × 1350 px · JPG,
            PNG or WebP · Max 5MB
          </p>

          <input
            id="mobile-banner"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                uploadImage(file, "mobile");
              }
            }}
          />

          <label
            htmlFor="mobile-banner"
            className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 p-8 text-center hover:bg-neutral-50"
          >
            {uploadingMobile
              ? "Uploading..."
              : mobileImagePreview
                ? "Change Mobile Image"
                : "Choose Mobile Image"}
          </label>

          {mobileImagePreview && (
            <div className="mt-4 overflow-hidden rounded-xl border">
              <img
                src={mobileImagePreview}
                alt="Mobile banner preview"
                className="h-64 w-full object-cover"
              />
            </div>
          )}
        </div>
        </>
        )}

        {/* POSITION */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Position
          </label>

          <select
            value={position}
            onChange={(e) =>
              setPosition(
                e.target.value as BannerPosition
              )
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          >
            <option value="hero">Hero</option>
            <option value="announcement">
              Announcement
            </option>
            <option value="collection">
              Collection
            </option>
            <option value="promotion">
              Promotion
            </option>
          </select>
        </div>

        {/* BUTTON TEXT */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Button Text
          </label>

          <input
            type="text"
            value={buttonText}
            onChange={(e) =>
              setButtonText(e.target.value)
            }
            placeholder="Shop Now"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* BUTTON LINK */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Button Link
          </label>

          <input
            type="text"
            value={buttonLink}
            onChange={(e) =>
              setButtonLink(e.target.value)
            }
            placeholder="/products"
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* DISPLAY ORDER */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Display Order
          </label>

          <input
            type="number"
            min="0"
            value={displayOrder}
            onChange={(e) =>
              setDisplayOrder(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* START */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Starts At
          </label>

          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) =>
              setStartsAt(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* END */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Ends At
          </label>

          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) =>
              setEndsAt(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        {/* ACTIVE */}
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
            className="h-4 w-4"
          />

          <span className="text-sm font-medium">
            Active
          </span>
        </label>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={
            loading ||
            uploadingDesktop ||
            uploadingMobile
          }
          className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading
            ? "Creating..."
            : "Create Banner"}
        </button>
      </div>
    </form>
  );
}