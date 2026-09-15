"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBanner } from "../actions/update-banner";

type BannerPosition =
  | "hero"
  | "announcement"
  | "collection"
  | "promotion";

type Banner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  button_text: string | null;
  button_link: string | null;
  image_url: string | null;
  mobile_image_url: string | null;
  background_color: string | null;
  position: BannerPosition;
  display_order: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
};

type Props = {
  banner: Banner;
};

function toDateTimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);

  return local.toISOString().slice(0, 16);
}

export default function EditBannerForm({ banner }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(banner.title ?? "");
  const [subtitle, setSubtitle] = useState(
    banner.subtitle ?? ""
  );
  const [buttonText, setButtonText] = useState(
    banner.button_text ?? ""
  );
  const [buttonLink, setButtonLink] = useState(
    banner.button_link ?? ""
  );

  const [imageUrl, setImageUrl] = useState(
    banner.image_url ?? ""
  );
  const [mobileImageUrl, setMobileImageUrl] =
    useState(banner.mobile_image_url ?? "");

  const [textOnly, setTextOnly] = useState(
    banner.position === "hero" && !banner.image_url
  );
  const [backgroundColor, setBackgroundColor] = useState(
    banner.background_color ?? "#103f35"
  );

  const [position, setPosition] =
    useState<BannerPosition>(banner.position);

  const [displayOrder, setDisplayOrder] = useState(
    String(banner.display_order)
  );

  const [startsAt, setStartsAt] = useState(
    toDateTimeLocal(banner.starts_at)
  );

  const [endsAt, setEndsAt] = useState(
    toDateTimeLocal(banner.ends_at)
  );

  const [isActive, setIsActive] = useState(
    banner.is_active
  );

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const isTextOnlyHero = position === "hero" && textOnly;

    if (!isTextOnlyHero && !imageUrl.trim()) {
      alert("Banner image URL is required.");
      return;
    }

    if (endsAt && startsAt) {
      if (
        new Date(endsAt) <=
        new Date(startsAt)
      ) {
        alert(
          "End date must be after start date."
        );
        return;
      }
    }

    try {
      setLoading(true);

      await updateBanner({
        id: banner.id,

        title: title.trim() || null,
        subtitle: subtitle.trim() || null,

        button_text:
          buttonText.trim() || null,

        button_link:
          buttonLink.trim() || null,

        image_url: isTextOnlyHero
          ? null
          : imageUrl.trim(),

        mobile_image_url: isTextOnlyHero
          ? null
          : mobileImageUrl.trim() || null,

        background_color: isTextOnlyHero
          ? backgroundColor
          : null,

        position,

        display_order:
          Number(displayOrder) || 0,

        starts_at: startsAt
          ? new Date(
              startsAt
            ).toISOString()
          : null,

        ends_at: endsAt
          ? new Date(
              endsAt
            ).toISOString()
          : null,

        is_active: isActive,
      });

      router.push("/admin/banners");
      router.refresh();
    } catch (error) {
      console.error(
        "UPDATE BANNER ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update banner."
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
      <div className="space-y-5">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Subtitle
          </label>

          <textarea
            value={subtitle}
            onChange={(e) =>
              setSubtitle(e.target.value)
            }
            rows={3}
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

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

        {!(position === "hero" && textOnly) && (
          <>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Image URL
              </label>

              <input
                type="text"
                value={imageUrl}
                onChange={(e) =>
                  setImageUrl(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Mobile Image URL
              </label>

              <input
                type="text"
                value={mobileImageUrl}
                onChange={(e) =>
                  setMobileImageUrl(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-3 outline-none"
              />
            </div>
          </>
        )}

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
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

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
            className="w-full rounded-xl border px-4 py-3 outline-none"
          />
        </div>

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
            Banner is active
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {loading
            ? "Updating..."
            : "Update Banner"}
        </button>
      </div>
    </form>
  );
}