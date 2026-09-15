import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getSiteContact } from "@/lib/site-contact";
import ContactForm from "@/features/contact/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Designer Threads.",
};

export default function ContactPage() {
  const contact = getSiteContact();

  const hasAnyChannel =
    contact.whatsappUrl ||
    contact.email ||
    contact.phone ||
    contact.address ||
    contact.instagramUrl ||
    contact.facebookUrl;

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

              <span className="text-[#103f35]">Contact</span>
            </div>

            <h1 className="mt-4 font-serif text-[2.6rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[3.4rem]">
              Contact
            </h1>

            <p className="mt-4 max-w-[560px] font-sans text-[13px] leading-6 text-[#60716e] sm:text-[14px]">
              Have a question about a piece, sizing, or an order? We&apos;d
              love to help.
            </p>
          </div>
        </section>

        {!hasAnyChannel ? (
          <div className="mx-auto max-w-[1680px] px-5 py-24 text-center sm:px-8 lg:px-12 xl:px-16">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Coming Soon
            </p>

            <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              We&apos;re setting up our contact channels.
            </h2>

            <p className="mt-2 text-[13px] text-[#60716e]">
              Check back shortly, or explore the collection in the meantime.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35]"
            >
              Explore the Shop
            </Link>
          </div>
        ) : (
          <section className="px-5 py-14 sm:px-8 md:py-16 lg:px-12 xl:px-16">
            <div className="mx-auto grid max-w-[1680px] gap-14 lg:grid-cols-[1fr_380px] lg:gap-20">
              {/* FORM */}
              <div>
                <h2 className="font-serif text-2xl tracking-[-0.02em] text-[#103f35]">
                  Send us a message
                </h2>

                <p className="mt-2 max-w-[480px] text-[13px] leading-6 text-[#60716e]">
                  Fill this in and it&apos;ll open as a WhatsApp message to
                  our team — quicker than email, and you&apos;ll hear back
                  from a real person.
                </p>

                <div className="mt-8 max-w-[480px]">
                  <ContactForm />
                </div>
              </div>

              {/* CHANNELS */}
              <aside className="h-fit border border-[#ddd6ca] bg-[#f4f0e8] p-7">
                <h2 className="font-serif text-lg text-[#103f35]">
                  Get in Touch
                </h2>

                <div className="mt-6 space-y-5">
                  {contact.whatsappUrl && (
                    <a
                      href={contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 text-[13px] text-[#171717] transition-colors hover:text-[#103f35]"
                    >
                      <MessageCircle
                        size={17}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-[#103f35]"
                      />
                      <span>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-[#60716e]">
                          WhatsApp
                        </span>
                        Chat with us directly
                      </span>
                    </a>
                  )}

                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-start gap-3 text-[13px] text-[#171717] transition-colors hover:text-[#103f35]"
                    >
                      <Mail
                        size={17}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-[#103f35]"
                      />
                      <span>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-[#60716e]">
                          Email
                        </span>
                        {contact.email}
                      </span>
                    </a>
                  )}

                  {contact.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="flex items-start gap-3 text-[13px] text-[#171717] transition-colors hover:text-[#103f35]"
                    >
                      <Phone
                        size={17}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-[#103f35]"
                      />
                      <span>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-[#60716e]">
                          Phone
                        </span>
                        {contact.phone}
                      </span>
                    </a>
                  )}

                  {contact.address && (
                    <div className="flex items-start gap-3 text-[13px] text-[#171717]">
                      <MapPin
                        size={17}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-[#103f35]"
                      />
                      <span>
                        <span className="block text-[10px] uppercase tracking-[0.1em] text-[#60716e]">
                          Showroom
                        </span>
                        {contact.address}
                      </span>
                    </div>
                  )}

                  {(contact.instagramUrl || contact.facebookUrl) && (
                    <div className="border-t border-[#ddd6ca] pt-5">
                      <span className="block text-[10px] uppercase tracking-[0.1em] text-[#60716e]">
                        Follow Along
                      </span>

                      <div className="mt-3 flex items-center gap-3">
                        {contact.instagramUrl && (
                          <a
                            href={contact.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd6ca] text-[#103f35] transition-colors hover:border-[#103f35]"
                            aria-label="Instagram"
                          >
                            <span className="text-[11px] font-medium">
                              IG
                            </span>
                          </a>
                        )}

                        {contact.facebookUrl && (
                          <a
                            href={contact.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd6ca] text-[#103f35] transition-colors hover:border-[#103f35]"
                            aria-label="Facebook"
                          >
                            <span className="text-[11px] font-medium">
                              FB
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
