import type { Metadata } from "next";
import {
  Inter,
  Cormorant_Garamond,
  Geist,
} from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { CartProvider } from "@/features/cart/context/cart-context";
import { WishlistProvider } from "@/features/wishlist/context/wishlist-context";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const defaultDescription =
  "Premium ethnic wear crafted with elegance and timeless design.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Designer Threads",
    template: "%s | Designer Threads",
  },
  description: defaultDescription,
  keywords: [
    "Designer Threads",
    "Ethnic Wear",
    "Women's Fashion",
    "Kurtis",
    "Suits",
    "Boutique",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Designer Threads",
    title: "Designer Threads",
    description: defaultDescription,
    url: siteUrl,
    images: [
      {
        url: "/images/banners/brand_statement.png",
        width: 1200,
        height: 1500,
        alt: "Designer Threads",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Designer Threads",
    description: defaultDescription,
    images: ["/images/banners/brand_statement.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        inter.variable,
        cormorant.variable,
        geist.variable,
        "font-sans"
      )}
    >
      <body>
        <CartProvider>
          <WishlistProvider>
            {children}
            <WhatsAppButton />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}