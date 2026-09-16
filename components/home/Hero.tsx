"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import type { Banner } from "@/features/banners/types/banner";

type Slide = {
  video?: string;
  image?: string;
  mobileImage?: string | null;
  backgroundColor?: string | null;
  title: React.ReactNode;
  subtitle?: string | null;
  buttonText: string;
  buttonLink: string;
};

const fallbackSlides: Slide[] = [
  {
    video: "/video1.mp4",
    title: (
      <>
        Timeless ethnic,
        <br />
        <em>worn forward.</em>
      </>
    ),
    buttonText: "SHOP THE COLLECTION",
    buttonLink: "/shop",
  },
  {
    video: "/video2.mp4",
    title: (
      <>
        Made to be
        <br />
        <em>remembered.</em>
      </>
    ),
    buttonText: "SHOP THE COLLECTION",
    buttonLink: "/shop",
  },
];

type HeroProps = {
  banners?: Banner[];
};

export default function Hero({ banners = [] }: HeroProps) {
  const slides = useMemo<Slide[]>(() => {
    if (banners.length === 0) return fallbackSlides;

    return banners.map((banner) => ({
      image: banner.image_url || undefined,
      mobileImage: banner.mobile_image_url,
      backgroundColor: banner.image_url
        ? null
        : banner.background_color || "#103f35",
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.button_text || "SHOP THE COLLECTION",
      buttonLink: banner.button_link || "/shop",
    }));
  }, [banners]);

  const [active, setActive] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  /*
   * Explicitly play the active slide's video and pause the rest.
   * Toggling the `autoPlay` attribute on an already-mounted <video>
   * does nothing in browsers — it only takes effect on initial mount —
   * so switching slides needs a real .play()/.pause() call here.
   */
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([index, videoEl]) => {
      if (!videoEl) return;

      if (Number(index) === active) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {
          // Autoplay can be blocked before any user interaction —
          // the video will still show its first frame.
        });
      } else {
        videoEl.pause();
      }
    });
  }, [active]);

  /*
   * Smooth text transition:
   * 1. Fade text out
   * 2. Change slide
   * 3. Fade new text in
   */
  useEffect(() => {
    setTextVisible(false);

    const timeout = setTimeout(() => {
      setTextVisible(true);
    }, 220);

    return () => clearTimeout(timeout);
  }, [active]);

  /*
   * Automatic slide rotation
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Guard against `active` pointing past the end of `slides` — e.g. right
  // after a hot-reload shrinks the slide list, or if the active banner set
  // changes size while a page is already open.
  useEffect(() => {
    if (active >= slides.length) {
      setActive(0);
    }
  }, [active, slides.length]);

  const slide = slides[active] ?? slides[0];

  return (
    <section className="relative h-[100svh] min-h-[680px] overflow-hidden bg-black text-white">

      {/* =====================================================
          BACKGROUND VIDEOS
      ====================================================== */}

      <div className="absolute inset-0">

        {slides.map((item, index) =>
          item.video ? (
            <video
              key={item.video}
              ref={(el) => {
                videoRefs.current[index] = el;
              }}
              src={item.video}
              autoPlay={index === 0}
              muted
              loop
              playsInline
              preload={index === active ? "auto" : "metadata"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : item.image ? (
            <img
              key={item.image}
              src={
                item.mobileImage
                  ? item.mobileImage
                  : item.image
              }
              srcSet={
                item.mobileImage
                  ? `${item.mobileImage} 768w, ${item.image} 1600w`
                  : undefined
              }
              sizes="100vw"
              alt=""
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : (
            <div
              key={`text-slide-${index}`}
              style={{
                backgroundColor:
                  item.backgroundColor || "#103f35",
              }}
              className={`absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-out ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            />
          )
        )}

        {/* Cinematic dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

        {/* Left readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
      </div>


      {/* =====================================================
          HERO CONTENT
          FIXED POSITION — NEVER MOVES BETWEEN SLIDES
      ====================================================== */}

      <div className="absolute inset-0 z-10">

        <div className="mx-auto h-full max-w-[1600px] px-6 sm:px-10 lg:px-16 xl:px-20">

          <div className="relative h-full">

            <div
              className={`
                absolute
                left-0
                top-1/2
                w-full
                max-w-[700px]
                -translate-y-[42%]

                transition-all
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]

                ${
                  textVisible
                    ? "translate-y-[-42%] opacity-100"
                    : "translate-y-[-40%] opacity-0"
                }
              `}
            >

              {/* =================================================
                  EYEBROW
              ================================================== */}

              


              {/* =================================================
                  TITLE
                  FIXED HEIGHT SO EVERY SLIDE HAS SAME STRUCTURE
              ================================================== */}

              <div className="mt-3 h-[215px] sm:h-[225px] lg:h-[235px]">

                <h1
                  className="
                    max-w-[700px]
                    font-serif
                    text-[clamp(3.7rem,6.2vw,6.8rem)]
                    leading-[0.86]
                    tracking-[-0.045em]
                    text-white
                  "
                >
                  {slide.title}
                </h1>

              </div>


              {/* =================================================
                  DESCRIPTION
              ================================================== */}

              {slide.subtitle && (
                <p className="mt-4 max-w-[480px] text-[14px] leading-6 text-white/80">
                  {slide.subtitle}
                </p>
              )}


              {/* =================================================
                  CTA
              ================================================== */}

              <div className="mt-4 h-[44px]">

                <Link
                  href={slide.buttonLink}
                  className="
                    group
                    inline-flex
                    h-[40px]
                    min-w-[245px]
                    items-center
                    justify-between
                    border
                    border-white/65
                    px-4
                    text-[10px]
                    font-medium
                    tracking-[0.2em]
                    text-white
                    transition-all
                    duration-300
                    hover:border-white
                    hover:bg-white
                    hover:text-[#103f35]
                  "
                >

                  <span>
                    {slide.buttonText}
                  </span>

                  <span
                    className="
                      ml-8
                      text-base
                      tracking-normal
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>

                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          SCROLL INDICATOR
          FIXED
      ====================================================== */}

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">

        <span className="text-[9px] font-medium tracking-[0.35em] text-white/75">
          SCROLL TO EXPLORE
        </span>

        <span className="mt-3 h-9 w-px bg-white/60" />

      </div>


      {/* =====================================================
          SLIDE INDICATOR
          FIXED RIGHT
      ====================================================== */}

      <div
        className="
          absolute
          right-7
          top-1/2
          z-20
          flex
          -translate-y-1/2
          flex-col
          items-center
          sm:right-10
          lg:right-14
        "
      >

        <span className="mb-4 text-[11px] font-medium text-white">
          {String(active + 1).padStart(2, "0")}
        </span>


        <div className="flex flex-col items-center gap-3">

          {slides.map((_, index) => (

            <button
              key={index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                w-px
                transition-all
                duration-500
                ${
                  index === active
                    ? "h-10 bg-white"
                    : "h-5 bg-white/35 hover:bg-white/70"
                }
              `}
            />

          ))}

        </div>


        <span className="mt-4 text-[11px] font-medium text-white/55">
          {String(slides.length).padStart(2, "0")}
        </span>

      </div>

    </section>
  );
}