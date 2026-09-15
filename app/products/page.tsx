import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProducts } from "@/features/products/actions/get-products";
import ProductCard from "@/features/products/components/product-card";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1680px]">
          <div className="mb-10">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              Collection
            </p>

            <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#103f35]">
              All Products
            </h1>

            <p className="mt-3 text-[13px] text-[#60716e]">
              Explore our latest collection.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="border border-[#ddd6ca] bg-white p-10 text-center">
              <h2 className="font-serif text-xl text-[#103f35]">
                No products available
              </h2>

              <p className="mt-2 text-[13px] text-[#60716e]">
                Check back soon for new pieces.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 lg:gap-x-10 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
