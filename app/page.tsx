import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import BrandStatement from "@/components/home/BrandStatement";
import FeaturedProducts from "@/features/products/components/featured-products";
import ProductGrid from "@/features/products/components/product-grid";
import Footer from "@/components/layout/Footer";
import { getActiveBanners } from "@/features/banners/actions/get-banners";
import PromotionBanner from "@/features/banners/components/promotion-banner";

const homeTitle = "Designer Threads | Premium Indian Ethnic Wear";
const homeDescription =
  "Thoughtfully crafted Indian wear that brings together traditional artistry, contemporary silhouettes and timeless elegance. Shop kurtis, suits and more.";

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
  },
  twitter: {
    title: homeTitle,
    description: homeDescription,
  },
};

export default async function HomePage() {
  const [heroBanners, promotionBanners] = await Promise.all([
    getActiveBanners("hero"),
    getActiveBanners("promotion"),
  ]);

  return (
    <main className="bg-white">
      <Navbar />
      <Hero banners={heroBanners} />
      <FeaturedProducts />
      {promotionBanners[0] && (
        <PromotionBanner banner={promotionBanners[0]} />
      )}
      <BrandStatement />
      <ProductGrid />
      <Footer />
    </main>
  );
}