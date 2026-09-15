import Navbar from "@/components/layout/Navbar";

export default function ShopLoading() {
  return (
    <>
      <Navbar />

      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white">
        <section className="border-b border-[#ddd6ca] bg-white px-5 py-10 sm:px-8 md:py-14 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px] space-y-4">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#103f35]/10" />
            <div className="h-10 w-40 animate-pulse rounded-full bg-[#103f35]/10 sm:h-12 sm:w-56" />
            <div className="h-3 w-72 animate-pulse rounded-full bg-[#103f35]/10 sm:w-96" />
          </div>
        </section>

        <section className="bg-white px-5 py-10 sm:px-8 md:py-12 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            <div className="h-[52px] animate-pulse border-b border-[#ddd6ca]" />

            <div className="flex gap-10 pt-8 xl:gap-14">
              <div className="hidden w-[220px] shrink-0 space-y-4 lg:block">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-4 w-3/4 animate-pulse rounded-full bg-[#103f35]/10" />
                ))}
              </div>

              <div className="grid flex-1 grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 sm:gap-y-16 md:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-[4/5] w-full rounded-[2px] bg-[#103f35]/10" />
                    <div className="mt-3 h-3 w-3/4 rounded-full bg-[#103f35]/10" />
                    <div className="mt-2 h-3 w-1/3 rounded-full bg-[#103f35]/10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
