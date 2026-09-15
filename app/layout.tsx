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

export const metadata: Metadata = {
  title: {
    default: "Designer Threads",
    template: "%s | Designer Threads",
  },
  description:
    "Premium ethnic wear crafted with elegance and timeless design.",
  keywords: [
    "Designer Threads",
    "Ethnic Wear",
    "Women's Fashion",
    "Kurtis",
    "Suits",
    "Boutique",
  ],
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