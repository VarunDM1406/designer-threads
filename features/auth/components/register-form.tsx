"use client";

import { useState, useTransition } from "react";
import { register } from "../actions/register";

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await register(formData);

      if (result?.message) {
        setMessage(result.message);
      }
    });
  }

  return (
    <div className="w-full max-w-lg border border-[#ddd6ca] bg-white p-8 sm:p-10">
      <p className="text-center text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
        Designer Threads
      </p>

      <h1 className="mt-3 text-center font-serif text-3xl tracking-[-0.03em] text-[#103f35] sm:text-4xl">
        Create Account
      </h1>

      <p className="mt-2 text-center text-[13px] text-[#60716e]">
        Join Designer Threads to track orders and save your details.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
            >
              First Name
            </label>

            <input
              id="firstName"
              name="firstName"
              required
              className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
              placeholder="First Name"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
            >
              Last Name
            </label>

            <input
              id="lastName"
              name="lastName"
              required
              className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            placeholder="Create password"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            placeholder="Confirm password"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#103f35] py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Creating Account..." : "Create Account"}
        </button>

        {message && (
          <p className="text-center text-[13px] font-medium text-[#b42318]">
            {message}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-[13px] text-[#60716e]">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-[#103f35] underline underline-offset-4"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}
