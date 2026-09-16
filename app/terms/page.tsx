import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteContact } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions that govern your use of the Designer Threads website and your purchases with us.",
  alternates: {
    canonical: "/terms",
  },
};

const LAST_UPDATED = "16 September 2026";

export default async function TermsPage() {
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

              <span className="text-[#103f35]">Terms &amp; Conditions</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Terms &amp; Conditions
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
              These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your
              access to and use of the Designer Threads website and any
              purchase you make with us. By browsing our site or placing an
              order, you agree to be bound by these Terms. Please read them
              carefully.
            </p>

            <div className="mt-12 space-y-10">
              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  1. About Us
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Designer Threads is an online store offering
                  contemporary Indian wear. References to &ldquo;we&rdquo;,
                  &ldquo;us&rdquo; or &ldquo;our&rdquo; refer to Designer
                  Threads, and &ldquo;you&rdquo; refers to the person
                  using our website or placing an order.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  2. Eligibility &amp; Accounts
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  You must be at least 18 years old, or be using our
                  website under the supervision of a parent or guardian,
                  to place an order with us. If you create an account,
                  you are responsible for maintaining the confidentiality
                  of your login details and for all activity that occurs
                  under your account.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  3. Products &amp; Pricing
                </h2>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>
                    We make every effort to display our products,
                    colours and fabric details as accurately as possible.
                    Minor variation between the product shown and the
                    item received can occur, as many of our pieces
                    involve handwork and natural fabrics.
                  </li>
                  <li>
                    All prices are listed in Indian Rupees (₹) and are
                    inclusive of applicable taxes unless stated
                    otherwise.
                  </li>
                  <li>
                    We reserve the right to change prices, correct
                    pricing errors, or discontinue any product at any
                    time without prior notice.
                  </li>
                  <li>
                    Product availability is not guaranteed until your
                    order is confirmed.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  4. Orders &amp; Payment
                </h2>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>
                    Placing an order is an offer to purchase, which we
                    may accept or decline at our discretion — for
                    example, in cases of pricing errors, stock
                    unavailability, or suspected fraud.
                  </li>
                  <li>
                    An order is confirmed only once you receive an order
                    confirmation from us.
                  </li>
                  <li>
                    Payments are processed through our third-party
                    payment gateway partners. We do not store your
                    complete card or banking credentials.
                  </li>
                  <li>
                    In the rare event of a duplicate or failed
                    transaction where an amount is debited, please
                    contact us with your order and transaction details
                    so we can help resolve it.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  5. Shipping, Returns &amp; Exchanges
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Shipping timelines, charges and our returns/exchange
                  process are described in detail in our{" "}
                  <Link
                    href="/shipping"
                    className="text-[#103f35] underline underline-offset-2"
                  >
                    Shipping Policy
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/returns"
                    className="text-[#103f35] underline underline-offset-2"
                  >
                    Returns Policy
                  </Link>
                  , both of which form part of these Terms.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  6. Intellectual Property
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  All content on this website — including product
                  photography, designs, text, logos and graphics — is the
                  property of Designer Threads or its licensors and is
                  protected by applicable intellectual property laws. You
                  may not reproduce, distribute, or use this content
                  commercially without our prior written consent.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  7. Acceptable Use
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  You agree not to misuse our website — including
                  attempting unauthorised access to our systems,
                  interfering with the site&apos;s normal operation, or
                  using it for any unlawful or fraudulent purpose.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  8. Limitation of Liability
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  To the fullest extent permitted by law, Designer
                  Threads shall not be liable for any indirect,
                  incidental or consequential loss arising from your use
                  of our website or products. Nothing in these Terms
                  limits any right you have under applicable consumer
                  protection law that cannot be excluded.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  9. Governing Law
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  These Terms are governed by the laws of India, and any
                  disputes arising from them will be subject to the
                  exclusive jurisdiction of the courts of India.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  10. Changes to These Terms
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We may revise these Terms from time to time. Changes
                  take effect once posted on this page with an updated
                  &ldquo;Last updated&rdquo; date. Continuing to use our
                  website after changes are posted means you accept the
                  revised Terms.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  11. Contact Us
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Questions about these Terms? Reach out to us:
                </p>

                <ul className="mt-3 space-y-1.5 text-[14px] leading-7 text-[#171717]">
                  {contact.email && <li>Email: {contact.email}</li>}
                  {contact.phone && <li>Phone: {contact.phone}</li>}
                  {contact.address && <li>Address: {contact.address}</li>}
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
