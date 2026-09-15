import Link from "next/link";
import Image from "next/image";

type OrderSuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function OrderSuccessPage({
  searchParams,
}: OrderSuccessPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-20">
      <Link
        href="/"
        className="mb-8 flex items-center gap-3"
      >
        <Image
          src="/images/logos/dt-logo.jpeg"
          alt="Designer Threads"
          width={44}
          height={44}
          className="rounded-full object-cover"
        />

        <span className="font-serif text-[19px] tracking-[-0.02em] text-[#103f35]">
          Designer Threads
        </span>
      </Link>

      <div className="mx-auto w-full max-w-xl border border-[#ddd6ca] bg-white p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0d4037]/10 text-2xl text-[#0d4037]">
          ✓
        </div>

        <h1 className="mt-6 font-serif text-3xl tracking-[-0.02em] text-[#103f35]">
          Order Placed Successfully
        </h1>

        <p className="mt-3 text-[13px] leading-6 text-[#60716e]">
          Thank you for your order. We have received it and will be in touch shortly.
        </p>

        {params.order && (
          <div className="mt-6 border border-[#ddd6ca] bg-[#f4f0e8] p-4">
            <p className="text-[11px] uppercase tracking-[0.1em] text-[#60716e]">
              Order ID
            </p>

            <p className="mt-1 break-all text-[13px] font-medium text-[#171717]">
              {params.order}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/shop"
            className="bg-[#103f35] px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="text-[13px] text-[#60716e] underline underline-offset-4 transition-colors hover:text-[#103f35]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
