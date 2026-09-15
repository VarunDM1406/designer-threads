import Link from "next/link";

import type { Banner } from "../types/banner";

type Props = {
  banner: Banner;
};

export default function PromotionBanner({ banner }: Props) {
  return (
    <section className="bg-white px-5 py-10 sm:px-8 md:py-14 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1680px]">
        <div className="relative overflow-hidden rounded-[2px]">
          <picture>
            {banner.mobile_image_url && (
              <source
                media="(max-width: 767px)"
                srcSet={banner.mobile_image_url}
              />
            )}

            <img
              src={banner.image_url ?? ""}
              alt={banner.title ?? ""}
              className="h-[220px] w-full object-cover sm:h-[280px] md:h-[320px]"
            />
          </picture>

          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-8 sm:px-12 md:px-16">
            {banner.title && (
              <h2 className="max-w-[560px] font-serif text-3xl leading-tight tracking-[-0.02em] text-white sm:text-4xl">
                {banner.title}
              </h2>
            )}

            {banner.subtitle && (
              <p className="max-w-[480px] text-[13px] leading-6 text-white/85">
                {banner.subtitle}
              </p>
            )}

            {banner.button_link && banner.button_text && (
              <Link
                href={banner.button_link}
                className="mt-2 inline-flex bg-white px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#103f35] transition-colors hover:bg-[#f4f0e8]"
              >
                {banner.button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
