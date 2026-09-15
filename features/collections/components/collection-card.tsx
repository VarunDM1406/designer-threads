import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export type CollectionCardData = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  banner_image_url?: string | null;
  thumbnail_image_url?: string | null;
};

type CollectionCardProps = {
  collection: CollectionCardData;
  aspect?: string;
};

export default function CollectionCard({
  collection,
  aspect = "aspect-[16/9]",
}: CollectionCardProps) {
  const image =
    collection.thumbnail_image_url ||
    collection.banner_image_url ||
    null;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group block"
    >
      <article className="relative overflow-hidden rounded-[2px] bg-[#e8e2d7]">
        <div className={`relative ${aspect} overflow-hidden`}>
          {image ? (
            <>
              <img
                src={image}
                alt={collection.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#ded7ca] via-[#eee9df] to-[#d3cabc] transition-transform duration-700 ease-out group-hover:scale-[1.02]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[clamp(2rem,4vw,4rem)] tracking-[-0.03em] text-[#103f35]/20">
                  {collection.name}
                </span>
              </div>
            </div>
          )}

          {/* Bottom information */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <div className="flex items-end justify-between">
              <div>
                <h3
                  className={`font-serif text-[25px] leading-tight tracking-[-0.02em] sm:text-[30px] ${
                    image ? "text-white" : "text-[#103f35]"
                  }`}
                >
                  {collection.name}
                </h3>

                {collection.description && (
                  <p
                    className={`mt-1.5 max-w-[420px] text-[11px] leading-5 ${
                      image ? "text-white/75" : "text-[#60716e]"
                    }`}
                  >
                    {collection.description}
                  </p>
                )}
              </div>

              <span className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#103f35] transition-transform duration-300 group-hover:translate-x-1">
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
