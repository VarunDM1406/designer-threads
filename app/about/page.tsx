import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteContact } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Designer Threads brings Indian craftsmanship into a contemporary wardrobe — considered, expressive and made for today.",
};

export default function AboutPage() {
  const { whatsappUrl } = getSiteContact();

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white">
        {/* HERO */}
        <section className="relative h-[70svh] min-h-[420px] w-full overflow-hidden bg-[#0b2b21]">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            src="/10547964-uhd_4096_2160_25fps.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          <div className="absolute inset-0 bg-black/35" />

          <div className="relative flex h-full flex-col justify-end px-5 pb-12 sm:px-8 md:pb-16 lg:px-12 xl:px-16">
            <div className="mx-auto w-full max-w-[1680px]">
              <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-white/70">
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>

                <ChevronRight size={12} strokeWidth={1.5} />

                <span className="text-white">About</span>
              </div>

              <h1 className="mt-4 font-serif text-[2.8rem] leading-[0.95] tracking-[-0.03em] text-white sm:text-[4rem]">
                Craft, made
                <br />
                <em>contemporary.</em>
              </h1>
            </div>
          </div>
        </section>

        {/* BRAND STORY */}
        <section className="px-5 py-16 sm:px-8 md:py-20 lg:px-12 xl:px-16">
          <div className="mx-auto grid max-w-[1680px] gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
                Our Story
              </p>

              <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35] sm:text-4xl">
                Rooted in Jaipur&apos;s textile traditions
              </h2>

              <div className="mt-6 space-y-5 text-[14px] leading-7 text-[#60716e]">
                <p>
                  Designer Threads brings Indian craftsmanship into a
                  contemporary wardrobe — considered, expressive and made
                  for today. We work from the belief that traditional
                  textile artistry doesn&apos;t need to be preserved
                  behind glass; it belongs in the everyday, worn with
                  intention.
                </p>

                <p>
                  Every piece is designed to sit at the meeting point of
                  heritage and modern silhouette — familiar techniques,
                  reconsidered for the way people actually get dressed
                  now. Nothing is rushed, and nothing is generic.
                </p>

                <p>
                  We keep our approach personal by design: browse the
                  collection, then talk to us directly on WhatsApp for
                  sizing, styling or anything else you need before you
                  decide. It&apos;s less like shopping a catalogue, more
                  like visiting a showroom that happens to fit in your
                  pocket.
                </p>
              </div>
            </div>

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] lg:aspect-auto">
              <img
                src="/images/banners/brand_statement.png"
                alt="Designer Threads craftsmanship"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* CRAFTSMANSHIP */}
        <section className="border-y border-[#ddd6ca] bg-[#f4f0e8] px-5 py-16 sm:px-8 md:py-20 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
              Craftsmanship
            </p>

            <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35] sm:text-4xl">
              Made with a considered hand
            </h2>

            <p className="mt-6 text-[14px] leading-7 text-[#60716e]">
              Fabric, fall and finish are never an afterthought. We favor
              traditional weaving and construction techniques, and we&apos;d
              rather ship a smaller collection we&apos;re proud of than a
              large one built to move fast. Each piece is meant to be worn
              for years, not a season.
            </p>
          </div>
        </section>

        {/* DESIGN PHILOSOPHY */}
        <section className="px-5 py-20 sm:px-8 md:py-28 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[900px] text-center">
            <h2 className="font-serif text-[2.4rem] leading-[1.05] tracking-[-0.03em] text-[#103f35] sm:text-[3.2rem]">
              &ldquo;Indian craft, <em>without standing still.</em>&rdquo;
            </h2>

            <p className="mt-6 text-[13px] uppercase tracking-[0.16em] text-[#60716e]">
              Our design philosophy, in five words
            </p>
          </div>
        </section>

        {/* CLOSING */}
        <section className="border-t border-[#ddd6ca] px-5 py-16 text-center sm:px-8 md:py-20 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            <h2 className="font-serif text-2xl tracking-[-0.02em] text-[#103f35] sm:text-3xl">
              See it for yourself
            </h2>

            <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#103f35] px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
              >
                Shop the Collection
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </Link>

              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#103f35]/30 px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#103f35] transition-colors hover:border-[#103f35]"
                >
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
