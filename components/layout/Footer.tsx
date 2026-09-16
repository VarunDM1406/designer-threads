"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getSiteContact } from "@/lib/site-contact";
import { InstagramIcon, FacebookIcon } from "@/components/icons/social";

const shopLinks = [
  { name: "Shop All", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "New Arrivals", href: "/shop?filter=new" },
  { name: "Best Sellers", href: "/shop?filter=bestseller" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
];

const customerLinks = [
  { name: "My Account", href: "/account" },
  { name: "My Orders", href: "/orders" },
  { name: "Wishlist", href: "/wishlist" },
  { name: "Shipping Policy", href: "/shipping" },
  { name: "Returns", href: "/returns" },
];

export default function Footer() {
  const [instagramUrl, setInstagramUrl] = useState<string | null>(null);
  const [facebookUrl, setFacebookUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSiteContact().then((contact) => {
      if (cancelled) return;

      setInstagramUrl(contact.instagramUrl);
      setFacebookUrl(contact.facebookUrl);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="border-t border-[#ddd6ca] bg-white text-[#171717]">

      {/* Main footer */}
      <div className="mx-auto max-w-[1680px] px-6 py-16 sm:px-8 md:py-20 lg:px-12 xl:px-16">

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-x-12">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <Image
                src="/images/logos/dt-logo.jpeg"
                alt="Designer Threads"
                width={46}
                height={46}
                className="rounded-full object-cover"
              />

              <span className="font-serif text-[21px] tracking-[-0.02em] text-[#103f35]">
                Designer Threads
              </span>
            </Link>

            <p className="mt-6 max-w-[340px] text-[13px] leading-6 text-[#60716e]">
              Thoughtfully crafted Indian wear that brings together
              traditional artistry, contemporary silhouettes and
              timeless elegance.
            </p>

            <Link
              href="/shop"
              className="group mt-7 inline-flex items-center gap-3 border-b border-[#103f35]/30 pb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#103f35] transition-colors hover:border-[#103f35]"
            >
              Explore the collection

              <ArrowUpRight
                size={13}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            {(instagramUrl || facebookUrl) && (
              <div className="mt-7 flex items-center gap-3">
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd6ca] text-[#103f35] transition-colors hover:border-[#103f35]"
                  >
                    <InstagramIcon />
                  </a>
                )}

                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ddd6ca] text-[#103f35] transition-colors hover:border-[#103f35]"
                  >
                    <FacebookIcon />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
              Shop
            </h3>

            <ul className="mt-5 space-y-3.5">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-[#60716e] transition-colors hover:text-[#103f35]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
              Further Info
            </h3>

            <ul className="mt-5 space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-[#60716e] transition-colors hover:text-[#103f35]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer care */}
          <div>
            <h3 className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
              Customer Care
            </h3>

            <ul className="mt-5 space-y-3.5">
              {customerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-[#60716e] transition-colors hover:text-[#103f35]"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#ddd6ca] bg-[#f4f0e8]">
        <div className="mx-auto flex max-w-[1680px] flex-col gap-3 px-6 py-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12 xl:px-16">

          <p className="text-[9px] uppercase tracking-[0.14em] text-[#60716e]">
            © {new Date().getFullYear()} Designer Threads. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/privacy"
              className="text-[9px] uppercase tracking-[0.14em] text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="text-[9px] uppercase tracking-[0.14em] text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              Terms
            </Link>

            <Link
              href="/shipping"
              className="text-[9px] uppercase tracking-[0.14em] text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              Shipping
            </Link>

            <Link
              href="/returns"
              className="text-[9px] uppercase tracking-[0.14em] text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
