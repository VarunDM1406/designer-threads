import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getCollections } from "@/features/collections/actions/get-collections";
import CollectionCard from "@/features/collections/components/collection-card";

export default async function ProductGrid() {
  const collections = await getCollections();

  const list = collections
    .filter((collection) => collection.is_active !== false)
    .slice(0, 4);

  if (!list.length) return null;

  return (
    <section className="bg-white px-5 py-16 sm:px-8 md:py-20 lg:px-12 xl:px-16">
      <div className="mx-auto max-w-[1680px]">

        {/* Heading */}
        <div className="mb-10 flex items-end justify-between md:mb-14">
          <div>
            <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.32em] text-[#a87932]">
              Shop By Edit
            </p>

            <h2 className="font-serif text-[2rem] leading-none tracking-[-0.03em] text-[#103f35] sm:text-[2.4rem]">
              The Collections
            </h2>
          </div>

          <Link
            href="/collections"
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

        {/* Collection cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {list.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-9 flex justify-center md:hidden">
          <Link
            href="/collections"
            className="group inline-flex items-center gap-2 border-b border-[#103f35]/30 pb-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#103f35]"
          >
            View all collections

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
