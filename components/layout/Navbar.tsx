"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/features/cart/context/cart-context";
import { useWishlist } from "@/features/wishlist/context/wishlist-context";
import AnnouncementBar from "@/features/banners/components/announcement-bar";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const shopMenu = [
  { name: "All Pieces", href: "/shop" },
  { name: "New Arrivals", href: "/shop?filter=new" },
  { name: "Best Sellers", href: "/shop?filter=bestseller" },
  { name: "Featured", href: "/shop?filter=featured" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent
          ? "bg-transparent text-white"
          : "bg-white text-[#171717] shadow-[0_1px_0_0_rgba(16,63,53,0.08)]"
      }`}
    >
      <AnnouncementBar />

      {/* ROW 1 — icons / centered logo / actions */}
      <div className="mx-auto flex h-[64px] w-full items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
        {/* LEFT */}
        <div className="flex flex-1 items-center gap-2">
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="p-2 md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={22} strokeWidth={1.5} />
            ) : (
              <Menu size={22} strokeWidth={1.5} />
            )}
          </button>

          <Link
            href={isLoggedIn ? "/account" : "/login"}
            aria-label="Account"
            className="hidden p-2 transition-opacity hover:opacity-60 md:block"
          >
            <UserRound size={20} strokeWidth={1.5} />
          </Link>
        </div>

        {/* CENTER — LOGO */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Designer Threads home"
          onClick={closeMobileMenu}
        >
          <Image
            src="/images/logos/dt-logo.jpeg"
            alt="Designer Threads"
            width={40}
            height={40}
            priority
            className="rounded-full object-cover"
          />

          <span
            className="hidden font-serif text-[19px] tracking-[-0.02em] sm:block"
          >
            Designer Threads
          </span>
        </Link>

        {/* RIGHT */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <form
            onSubmit={handleSearchSubmit}
            className={`relative mr-1 hidden items-center lg:flex ${
              transparent ? "" : ""
            }`}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="What are you looking for"
              className={`h-9 w-[190px] border bg-transparent pl-3 pr-8 text-[12px] outline-none transition-colors ${
                transparent
                  ? "border-white/40 text-white placeholder:text-white/60 focus:border-white"
                  : "border-[#ddd6ca] text-[#171717] placeholder:text-[#60716e] focus:border-[#103f35]"
              }`}
            />

            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
            >
              <Search size={15} strokeWidth={1.5} />
            </button>
          </form>

          <Link
            href="/search"
            aria-label="Search"
            className="p-2 transition-opacity hover:opacity-60 lg:hidden"
          >
            <Search size={20} strokeWidth={1.5} />
          </Link>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden p-2 transition-opacity hover:opacity-60 md:block"
          >
            <Heart size={20} strokeWidth={1.5} />

            {wishlistCount > 0 && (
              <span
                className={`absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-semibold ${
                  transparent
                    ? "bg-white text-[#103f35]"
                    : "bg-[#103f35] text-white"
                }`}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="relative p-2 transition-opacity hover:opacity-60"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />

            {itemCount > 0 && (
              <span
                className={`absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-semibold ${
                  transparent
                    ? "bg-white text-[#103f35]"
                    : "bg-[#103f35] text-white"
                }`}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ROW 2 — full nav */}
      <nav
        className={`hidden h-[46px] items-center justify-center gap-10 border-t md:flex ${
          transparent ? "border-white/20" : "border-[#ddd6ca]"
        }`}
        aria-label="Main navigation"
      >
        {navLinks.map((item) => {
          const active = isActive(item.href);
          const hasDropdown = item.name === "Shop";

          return (
            <div key={item.name} className="group relative h-full">
              <Link
                href={item.href}
                className="flex h-full items-center py-2 text-[12px] font-medium uppercase tracking-[0.16em]"
              >
                {item.name}

                <span
                  className={`absolute bottom-0 left-0 h-px transition-all duration-300 ${
                    transparent ? "bg-white" : "bg-[#a87932]"
                  } ${active ? "w-full" : "w-0 group-hover:w-full"}`}
                />
              </Link>

              {hasDropdown && (
                <div className="invisible absolute left-1/2 top-full z-10 w-[200px] -translate-x-1/2 border border-[#ddd6ca] bg-white opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  {shopMenu.map((entry) => (
                    <Link
                      key={entry.name}
                      href={entry.href}
                      className="block px-5 py-3 text-[11px] uppercase tracking-[0.12em] text-[#171717] transition-colors hover:bg-[#f4f0e8] hover:text-[#103f35]"
                    >
                      {entry.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden ${
            transparent
              ? "bg-[#123d2f]/95 text-white backdrop-blur-md"
              : "border-t border-[#ddd6ca] bg-white text-[#171717]"
          }`}
        >
          <div className="px-5 py-5">
            <form
              onSubmit={(event) => {
                handleSearchSubmit(event);
                closeMobileMenu();
              }}
              className="relative mb-4"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="What are you looking for"
                className="h-11 w-full border border-current bg-transparent pl-4 pr-10 text-[13px] outline-none"
              />

              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search size={16} strokeWidth={1.5} />
              </button>
            </form>

            <div className="flex flex-col">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="border-b border-current/15 py-4 text-[13px] uppercase tracking-[0.12em]"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-5">
              <Link
                href="/wishlist"
                onClick={closeMobileMenu}
                className="relative flex h-[46px] w-[46px] items-center justify-center border border-current"
              >
                <Heart size={19} strokeWidth={1.5} />

                {wishlistCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#a87932] px-1 text-[10px] font-semibold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                onClick={closeMobileMenu}
                className="relative flex h-[46px] w-[46px] items-center justify-center border border-current"
              >
                <ShoppingBag size={19} strokeWidth={1.5} />

                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#a87932] px-1 text-[10px] font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>

              <Link
                href={isLoggedIn ? "/account" : "/login"}
                onClick={closeMobileMenu}
                className="flex h-[46px] w-[46px] items-center justify-center border border-current"
              >
                <UserRound size={19} strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
