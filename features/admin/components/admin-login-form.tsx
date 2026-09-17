"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { login } from "@/features/auth/actions/login";

export default function AdminLoginForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("next", "/admin");

    startTransition(async () => {
      const result = await login(formData);

      if (result?.message) {
        setMessage(result.message);
      }
    });
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111827] p-8 shadow-[0_20px_48px_-16px_rgba(0,0,0,0.5)] sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
        <ShieldCheck size={22} strokeWidth={1.5} className="text-emerald-400" />
      </div>

      <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
        Designer Threads
      </p>

      <h1 className="mt-2 text-center text-2xl font-semibold tracking-tight text-white">
        Admin Console
      </h1>

      <p className="mt-2 text-center text-[13px] text-gray-400">
        Restricted access — staff sign in only
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400"
          >
            Email
          </label>

          <div className="relative">
            <Mail
              size={16}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              id="admin-email"
              name="email"
              type="email"
              required
              placeholder="admin@designerthreads.in"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-[14px] text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-medium uppercase tracking-[0.1em] text-gray-400"
            >
              Password
            </label>

            <Link
              href="/forgot-password"
              className="text-[11px] text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-300"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock
              size={16}
              strokeWidth={1.5}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-[14px] text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500/50"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
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
          className="w-full rounded-lg bg-emerald-500 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0b1220] transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Signing In..." : "Sign In to Admin"}
        </button>

        {message && (
          <p className="text-center text-[13px] font-medium text-red-400">
            {message}
          </p>
        )}
      </form>

      <Link
        href="/"
        className="mt-8 block text-center text-[12px] text-gray-500 underline underline-offset-4 transition-colors hover:text-gray-300"
      >
        ← Back to store
      </Link>
    </div>
  );
}
