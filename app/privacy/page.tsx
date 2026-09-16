import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteContact } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Designer Threads collects, uses and protects your personal information.",
  alternates: {
    canonical: "/privacy",
  },
};

const LAST_UPDATED = "16 September 2026";

export default async function PrivacyPolicyPage() {
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

              <span className="text-[#103f35]">Privacy Policy</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Privacy Policy
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
              Designer Threads (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
              &ldquo;our&rdquo;) respects your privacy and is committed to
              protecting the personal information you share with us. This
              Privacy Policy explains what information we collect, how we
              use it, and the choices you have. By using our website or
              placing an order with us, you agree to the practices
              described here.
            </p>

            <div className="mt-12 space-y-10">
              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  1. Information We Collect
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We collect information you provide directly to us, and
                  information generated automatically when you use our
                  website:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>
                    <span className="font-medium text-[#171717]">
                      Account and order details
                    </span>{" "}
                    — name, email address, phone number, shipping and
                    billing address, and order history.
                  </li>
                  <li>
                    <span className="font-medium text-[#171717]">
                      Communications
                    </span>{" "}
                    — messages you send us via WhatsApp, email, our
                    contact form, or social media.
                  </li>
                  <li>
                    <span className="font-medium text-[#171717]">
                      Payment information
                    </span>{" "}
                    — processed securely by our payment gateway partners.
                    We do not store your full card, UPI or net-banking
                    credentials on our servers.
                  </li>
                  <li>
                    <span className="font-medium text-[#171717]">
                      Usage data
                    </span>{" "}
                    — pages you visit, items you view or wishlist, and
                    general device/browser information, collected through
                    cookies and similar technologies.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  2. How We Use Your Information
                </h2>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>To process, fulfil and deliver your orders.</li>
                  <li>
                    To communicate with you about your order, account, or
                    enquiries you raise with us.
                  </li>
                  <li>
                    To improve our website, products and customer
                    experience.
                  </li>
                  <li>
                    To send you updates about new collections, offers or
                    promotions — only where you&apos;ve opted in, and you
                    can unsubscribe at any time.
                  </li>
                  <li>
                    To detect, prevent and address fraud, abuse or
                    security issues.
                  </li>
                  <li>
                    To comply with applicable legal and regulatory
                    obligations.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  3. Sharing Your Information
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We do not sell your personal information. We share it
                  only where necessary to run our business:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#60716e]">
                  <li>
                    With courier and logistics partners, to deliver your
                    order.
                  </li>
                  <li>
                    With payment gateway providers, to process
                    transactions securely.
                  </li>
                  <li>
                    With service providers who help us operate the
                    website (hosting, analytics, customer support tools),
                    bound by confidentiality obligations.
                  </li>
                  <li>
                    Where required by law, regulation, or a valid request
                    from a public authority.
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  4. Cookies
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We use cookies and similar technologies to keep you
                  signed in, remember items in your cart or wishlist, and
                  understand how our website is used. You can control or
                  disable cookies through your browser settings, though
                  some parts of the site may not function as intended if
                  you do.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  5. Data Security
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We use reasonable technical and organisational measures
                  to protect your personal information against
                  unauthorised access, loss, or misuse. No method of
                  transmission or storage over the internet is completely
                  secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  6. Data Retention
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We retain your personal information for as long as your
                  account is active or as needed to fulfil orders, resolve
                  disputes, and comply with our legal obligations, after
                  which it is deleted or anonymised.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  7. Your Rights
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  You can ask us to access, correct, update or delete the
                  personal information we hold about you, and you can
                  opt out of marketing communications at any time. To
                  exercise any of these rights, reach out to us using the
                  details below.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  8. Children&apos;s Privacy
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  Our website is not directed at children under 18, and we
                  do not knowingly collect personal information from
                  them. If you believe a child has provided us with
                  personal information, please contact us and we will
                  remove it.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  9. Changes to This Policy
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  We may update this Privacy Policy from time to time to
                  reflect changes in our practices or for other
                  operational, legal or regulatory reasons. The updated
                  version will be posted on this page with a revised
                  &ldquo;Last updated&rdquo; date.
                </p>
              </div>

              <div>
                <h2 className="font-serif text-xl tracking-[-0.01em] text-[#103f35] sm:text-2xl">
                  10. Contact Us
                </h2>

                <p className="mt-3 text-[14px] leading-7 text-[#60716e]">
                  If you have any questions about this Privacy Policy or
                  how we handle your information, please get in touch:
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
