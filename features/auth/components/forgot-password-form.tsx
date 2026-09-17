"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { forgotPassword } from "../actions/forgot-password";

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await forgotPassword(formData);

      setSuccess(Boolean(result?.success));

      if (result?.message) {
        setMessage(result.message);
      }
    });
  }

  return (
    <div className="w-full max-w-md bg-white p-8 shadow-[0_1px_3px_rgba(16,63,53,0.06),0_20px_48px_-16px_rgba(16,63,53,0.12)] sm:p-10">
      <p className="text-center text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
        Designer Threads
      </p>

      <h1 className="mt-3 text-center font-serif text-3xl tracking-[-0.03em] text-[#103f35] sm:text-4xl">
        Reset Password
      </h1>

      <p className="mt-2 text-center text-[13px] text-[#60716e]">
        Enter your email and we&apos;ll send you a link to reset it.
      </p>

      {success ? (
        <div className="mt-8 rounded-sm border border-[#0b7a4b]/25 bg-[#0b7a4b]/5 p-4 text-center text-[13px] text-[#0b7a4b]">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
            >
              Email
            </label>

            <div className="relative">
              <Mail
                size={16}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#60716e]"
              />

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full border border-[#ddd6ca] py-3 pl-11 pr-4 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#103f35]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#103f35] py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send Reset Link"}
          </button>

          {message && (
            <p className="text-center text-[13px] font-medium text-[#b42318]">
              {message}
            </p>
          )}
        </form>
      )}

      <p className="mt-6 text-center text-[13px] text-[#60716e]">
        <Link
          href="/login"
          className="font-medium text-[#103f35] underline underline-offset-4"
        >
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
