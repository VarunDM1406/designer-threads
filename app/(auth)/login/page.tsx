import Link from "next/link";
import Image from "next/image";

import LoginForm from "@/features/auth/components/login-form";

type Props = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen bg-[#faf8f3]">
      {/* LEFT — editorial image panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-[#0b2b21] lg:block">
        <video
          src="/video1.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/images/logos/dt-logo.jpeg"
              alt="Designer Threads"
              width={44}
              height={44}
              className="rounded-full object-cover"
            />

            <span className="font-serif text-[19px] tracking-[-0.02em] text-white">
              Designer Threads
            </span>
          </Link>

          <blockquote className="max-w-[440px]">
            <p className="font-serif text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-white xl:text-[2.6rem]">
              Welcome back to
              <br />
              <em>timeless craft.</em>
            </p>

            <p className="mt-4 text-[13px] leading-6 text-white/70">
              Sign in to track your orders, revisit your wishlist, and
              pick up right where you left off.
            </p>
          </blockquote>
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2 lg:px-12">
        <Link
          href="/"
          className="mb-10 flex items-center gap-3 lg:hidden"
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

        <LoginForm next={params.next || "/"} />
      </div>
    </main>
  );
}
