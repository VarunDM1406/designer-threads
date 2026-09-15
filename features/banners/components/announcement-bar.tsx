"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { getActiveBanners } from "../actions/get-banners";
import type { Banner } from "../types/banner";

const DISMISS_KEY = "designer-threads-announcement-dismissed";
const BAR_HEIGHT = "36px";

export default function AnnouncementBar() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getActiveBanners("announcement").then((banners) => {
      if (cancelled) return;

      const first = banners[0] ?? null;
      setBanner(first);

      if (first) {
        setDismissed(
          sessionStorage.getItem(DISMISS_KEY) === first.id
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const visible = Boolean(banner) && !dismissed;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--announcement-h",
      visible ? BAR_HEIGHT : "0px"
    );
  }, [visible]);

  if (!visible || !banner) return null;

  function handleDismiss() {
    if (banner) sessionStorage.setItem(DISMISS_KEY, banner.id);
    setDismissed(true);
  }

  const content = (
    <span className="truncate">
      {banner.title}
      {banner.subtitle && (
        <span className="ml-2 opacity-80">{banner.subtitle}</span>
      )}
    </span>
  );

  return (
    <div
      className="relative flex items-center justify-center gap-2 bg-[#103f35] px-10 text-[11px] font-medium tracking-[0.04em] text-white"
      style={{ height: BAR_HEIGHT }}
    >
      {banner.button_link ? (
        <Link href={banner.button_link} className="hover:underline">
          {content}
          {banner.button_text && (
            <span className="ml-2 underline underline-offset-2">
              {banner.button_text}
            </span>
          )}
        </Link>
      ) : (
        content
      )}

      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 transition-opacity hover:opacity-100"
      >
        <X size={13} strokeWidth={1.5} />
      </button>
    </div>
  );
}
