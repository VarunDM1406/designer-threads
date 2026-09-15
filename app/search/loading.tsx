import Navbar from "@/components/layout/Navbar";

export default function SearchLoading() {
  return (
    <>
      <Navbar />

      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white">
        <section className="border-b border-[#ddd6ca] bg-white px-5 py-10 sm:px-8 md:py-14 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px] space-y-4">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#103f35]/10" />
            <div className="h-10 w-40 animate-pulse rounded-full bg-[#103f35]/10 sm:h-12 sm:w-56" />
          </div>
        </section>

        <section className="bg-white px-5 py-10 sm:px-8 md:py-12 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1680px]">
            <div className="mx-auto h-12 max-w-[560px] animate-pulse border-b border-[#ddd6ca]" />
          </div>
        </section>
      </main>
    </>
  );
}
