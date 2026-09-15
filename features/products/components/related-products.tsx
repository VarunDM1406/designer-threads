import ProductCard from "./product-card";

type RelatedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  compare_at_price?: number | string | null;
  stock_quantity?: number | null;
  product_images?: {
    id?: string;
    image_url: string;
    alt_text?: string | null;
    is_primary?: boolean | null;
    display_order?: number | null;
  }[];
};

type RelatedProductsProps = {
  products: RelatedProduct[];
};

export default function RelatedProducts({
  products,
}: RelatedProductsProps) {
  return (
    <section className="mt-20 border-t border-[#ddd6ca] pt-14 sm:mt-24 sm:pt-16">
      <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
        You May Also Like
      </p>

      <h2 className="mt-3 font-serif text-2xl tracking-[-0.02em] text-[#103f35] sm:text-3xl">
        Complete the Look
      </h2>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
