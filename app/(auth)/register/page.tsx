import Link from "next/link";
import Image from "next/image";

import RegisterForm from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
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

      <RegisterForm />
    </main>
  );
}
