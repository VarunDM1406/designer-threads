import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteContact } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description:
    "Our returns, exchange and refund policy for Designer Threads orders.",
  alternates: {
    canonical: "/returns",
  },
};

const LAST_UPDATED = "16 September 2026";

export default async function ReturnsPolicyPage() {
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

              <span className="text-[#103f35]">Returns &amp; Exchanges</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Returns &amp; Exchanges
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
              We want you to love what you order. If something isn&apos;t
              right, here&apos;s how returns and exchanges work.
            </p>

            <div className="mt-12 space-y-10">
              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  1. Return Window
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  You can request a return or exchange within{" "}
                  <span className="font-medium text-[#171717]">
                    7 days of delivery
                  </span>
                  . Requests raised after this window unfortunately
                  can&apos;t be accepted.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  2. Eligibility
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  To be eligible for a return or exchange, an item must
                  be:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>Unworn, unwashed, and unused.</li>
                  <li>
                    In its original condition, with all tags and any
                    original packaging intact.
                  </li>
                  <li>Free of any alterations made after delivery.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  3. Non-Returnable Items
                </h2>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>
                    Made-to-order or made-to-measure pieces, unless
                    received damaged or defective.
                  </li>
                  <li>
                    Items marked &ldquo;Final Sale&rdquo; at the time of
                    purchase.
                  </li>
                  <li>
                    Items showing signs of wear, alteration, or damage
                    not present at delivery.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  4. How to Start a Return
                </h2>

                <ol className="mt-3 list-decimal space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>
                    Go to{" "}
                    <Link
                      href="/orders"
                      className="text-[#103f35] underline underline-offset-2"
                    >
                      My Orders
                    </Link>{" "}
                    or message us on WhatsApp with your order number.
                  </li>
                  <li>
                    Let us know whether you&apos;d like a return
                    (refund) or an exchange, and the reason.
                  </li>
                  <li>
                    We&apos;ll confirm eligibility and arrange a pickup
                    where serviceable, or share a return address if a
                    self-ship is needed.
                  </li>
                  <li>Pack the item securely with the original tags.</li>
                </ol>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  5. Refunds
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Once we receive and inspect the returned item, refunds
                  are processed to your original payment method within
                  7–10 business days. For prepaid orders, the amount is
                  refunded to the original source; for cash-on-delivery
                  orders, we&apos;ll arrange a bank transfer or offer
                  store credit — whichever you prefer.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  6. Exchanges
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Need a different size or colour? We&apos;ll happily
                  exchange it, subject to availability. If the item
                  you&apos;d like isn&apos;t in stock, we&apos;ll offer a
                  refund or store credit instead.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  7. Damaged or Defective Items
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  If your order arrives damaged, defective, or incorrect,
                  contact us within 48 hours of delivery with photos of
                  the item and packaging. We&apos;ll cover the cost of
                  return shipping in these cases and prioritise a
                  replacement or full refund.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  8. Return Shipping Costs
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  For returns due to a change of mind (size, style,
                  preference), return shipping costs are generally borne
                  by the customer unless we&apos;ve arranged a free
                  pickup for your area. For damaged, defective or
                  incorrect items, we cover the cost.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  9. Need Help?
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We&apos;re happy to help with anything return-related:
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
