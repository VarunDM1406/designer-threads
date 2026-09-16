import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteContact } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Delivery timelines, charges and tracking information for Designer Threads orders.",
};

const LAST_UPDATED = "16 September 2026";

export default async function ShippingPolicyPage() {
  const contact = await getSiteContact();

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white">
        {/* HEADER */}
        <section className="border-b border-[#ddd6ca] bg-white px-5 py-10 sm:px-8 md:py-14 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
              <Link href="/" className="transition-colors hover:text-[#103f35]">
                Home
              </Link>

              <ChevronRight size={12} strokeWidth={1.5} />

              <span className="text-[#103f35]">Shipping Policy</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Shipping Policy
            </h1>

            <p className="mt-4 max-w-[560px] font-sans text-[13px] leading-6 text-[#60716e] sm:text-[14px]">
              Last updated {LAST_UPDATED}
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="px-5 py-14 sm:px-8 md:py-16 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[820px]">
            <p className="text-[14px] leading-7 text-[#60716e]">
              Every piece is packed with care before it leaves us. Here&apos;s
              what to expect once your order is placed.
            </p>

            <div className="mt-12 space-y-10">
              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  1. Delivery Areas
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We currently ship across India. If you&apos;re outside
                  India and would like to order, message us on WhatsApp
                  and we&apos;ll try to arrange it where possible.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  2. Processing Time
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Orders are usually processed and handed over to our
                  courier partner within 1–3 business days of
                  confirmation. Made-to-order or heavily embellished
                  pieces may take a little longer — if that applies to
                  your order, we&apos;ll let you know the expected
                  timeline before you check out.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  3. Delivery Timelines
                </h2>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>Metro cities: typically 3–5 business days.</li>
                  <li>
                    Other cities and towns: typically 5–8 business days.
                  </li>
                  <li>
                    Remote or hard-to-reach pin codes may take a little
                    longer, depending on courier serviceability.
                  </li>
                </ul>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  These are estimates and not guarantees — timelines can
                  be affected by courier delays, weather, or events
                  outside our control.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  4. Shipping Charges
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Any applicable shipping charges are calculated and
                  shown at checkout before you complete your order. We
                  periodically run free-shipping offers above a minimum
                  order value — these will be shown at checkout when
                  active.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  5. Order Tracking
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Once your order ships, we&apos;ll send you a tracking
                  link by email/WhatsApp so you can follow it to your
                  door. You can also check the status of your order any
                  time from{" "}
                  <Link
                    href="/orders"
                    className="text-[#103f35] underline underline-offset-2"
                  >
                    My Orders
                  </Link>
                  .
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  6. Delays &amp; Undelivered Packages
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  If your order is significantly delayed, marked
                  delivered but not received, or returned to us as
                  undeliverable (for example due to an incorrect
                  address or a failed delivery attempt), please contact
                  us right away so we can look into it and arrange a
                  reshipment or resolution.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  7. Damaged in Transit
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Please inspect your order as soon as it arrives. If a
                  piece is damaged in transit, contact us within 48 hours
                  of delivery with a photo of the item and packaging, and
                  we&apos;ll sort out a replacement or refund — see our{" "}
                  <Link
                    href="/returns"
                    className="text-[#103f35] underline underline-offset-2"
                  >
                    Returns Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  8. Questions
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Anything about your delivery we haven&apos;t covered
                  here? Reach out to us:
                </p>

                <ul className="mt-3 space-y-1.5 text-[14px] leading-7 text-[#171717]">
                  {contact.email && <li>Email: {contact.email}</li>}
                  {contact.phone && <li>Phone: {contact.phone}</li>}
                  {contact.whatsappUrl && (
                    <li>
                      <a
                        href={contact.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#103f35] underline underline-offset-2"
                      >
                        Message us on WhatsApp
                      </a>
                    </li>
                  )}
                  <li>
                    Or use our{" "}
                    <Link
                      href="/contact"
                      className="text-[#103f35] underline underline-offset-2"
                    >
                      Contact page
                    </Link>
                    .
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
