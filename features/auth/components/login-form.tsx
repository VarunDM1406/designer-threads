"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { login } from "../actions/login";

type Props = {
  next?: string;
};

export default function LoginForm({
  next = "/",
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    const formData = new FormData(event.currentTarget);

    // Tell the server where the customer should go
    // after successful login.
    formData.set("next", next);

    startTransition(async () => {
      const result = await login(formData);

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
        Welcome Back
      </h1>

      <p className="mt-2 text-center text-[13px] text-[#60716e]">
        Sign in to your account
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
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

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
          >
            Password
          </label>

          <div className="relative">
            <Lock
              size={16}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#60716e]"
            />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              className="w-full border border-[#ddd6ca] py-3 pl-11 pr-11 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#103f35]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              {showPassword ? (
                <EyeOff size={16} strokeWidth={1.5} />
              ) : (
                <Eye size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#103f35] py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </button>

        {message && (
          <p className="text-center text-[13px] font-medium text-[#b42318]">
            {message}
          </p>
        )}
      </form>

      <p className="mt-6 text-center text-[13px] text-[#60716e]">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="font-medium text-[#103f35] underline underline-offset-4"
        >
          Create one
        </a>
      </p>

      <p className="mt-4 text-center text-[11px] text-[#a8a29e]">
        <a
          href="/admin/login"
          className="underline underline-offset-4 transition-colors hover:text-[#60716e]"
        >
          Login as Admin
        </a>
      </p>
    </div>
  );
}
