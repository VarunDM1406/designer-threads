export default function BrandStatement() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative min-h-[430px] w-full md:min-h-[500px]">

        {/* Jaipur visual */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/banners/brand_statement.png')",
          }}
        />

        {/* Soft fade into the text area */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[430px] items-center md:min-h-[500px]">
          <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20">
            <div className="max-w-[620px]">

              <h2 className="font-serif text-[clamp(3rem,5vw,5.5rem)] leading-[0.9] tracking-[-0.04em] text-[#103f35]">
                Indian craft,
                <br />
                <em>without standing still.</em>
              </h2>

              <p className="mt-7 max-w-[500px] text-[14px] leading-7 text-[#496966] sm:text-[15px]">
                Rooted in Jaipur&apos;s textile traditions, Designer Threads brings
                Indian craftsmanship into a contemporary wardrobe — considered,
                expressive and made for today.
              </p>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}