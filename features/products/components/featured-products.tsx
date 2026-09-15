import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProducts } from "@/features/products/actions/get-products";
import ProductCard from "@/features/products/components/product-card";

export default async function FeaturedProducts() {
  const products = await getProducts();

  const featured = (products ?? [])
    .filter((product) => product.is_active !== false)
    .filter(
      (product) =>
        product.is_featured ||
        product.is_best_seller ||
        product.is_new_arrival
    )
    .slice(0, 4);

  const list =
    featured.length > 0
      ? featured
      : (products ?? [])
          .filter((product) => product.is_active !== false)
          .slice(0, 4);

  if (list.length === 0) return null;

  return (
    <section className="bg-white px-5 py-16 sm:px-8 md:py-20 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1680px]">

        {/* HEADER */}
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <div className="text-left">
            <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.32em] text-[#a87932]">
              New This Season
            </p>

            <h2 className="font-serif text-[2rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[2.4rem]">
              Featured Pieces
            </h2>
          </div>

          {/* DESKTOP VIEW ALL */}
          <Link
            href="/shop"
            className="group hidden items-center gap-2 border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35] transition-colors hover:border-[#103f35] md:flex"
          >
            View all
            <ArrowUpRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* PRODUCT GRID */}
        <div
          className={
            list.length === 1
              ? "mx-auto w-full max-w-[340px]"
              : "grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3 lg:gap-x-10 xl:grid-cols-4"
          }
        >
          {list.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35]"
          >
            View all pieces

            <ArrowUpRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

      </div>
    </section>
  );
}