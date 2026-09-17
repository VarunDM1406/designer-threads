"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { resetPassword } from "../actions/reset-password";
import PasswordChecklist from "./password-checklist";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  // A plain logged-in session isn't proof this visit came from a valid
  // recovery email — someone already signed in elsewhere could otherwise
  // land here and change their password with no verification at all.
  // Supabase fires a dedicated PASSWORD_RECOVERY auth event only when the
  // session was established via the recovery link, so gate the form on
  // that instead of just "is anyone logged in."
  const [recoveryVerified, setRecoveryVerified] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecoveryVerified(true);
        setCheckingRecovery(false);
      }
    });

    const timeout = setTimeout(() => {
      setCheckingRecovery(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await resetPassword(formData);

      if (result?.message) {
        setMessage(result.message);
      }

      if (result?.success) {
        setSuccess(true);

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    });
  }

  return (
    <div className="w-full max-w-md bg-white p-8 shadow-[0_1px_3px_rgba(16,63,53,0.06),0_20px_48px_-16px_rgba(16,63,53,0.12)] sm:p-10">
      <p className="text-center text-[9px] font-medium uppercase tracking-[0.3em] text-[#a87932]">
        Designer Threads
      </p>

      <h1 className="mt-3 text-center font-serif text-3xl tracking-[-0.03em] text-[#103f35] sm:text-4xl">
        Set New Password
      </h1>

      <p className="mt-2 text-center text-[13px] text-[#60716e]">
        Choose a new password for your account.
      </p>

      {checkingRecovery ? (
        <p className="mt-8 text-center text-[13px] text-[#60716e]">
          Verifying your reset link…
        </p>
      ) : !recoveryVerified ? (
        <div className="mt-8 space-y-4">
          <div className="rounded-sm border border-[#b42318]/25 bg-[#b42318]/5 p-4 text-center text-[13px] text-[#b42318]">
            This reset link is invalid or has expired.
          </div>

          <a
            href="/forgot-password"
            className="block text-center text-[13px] font-medium text-[#103f35] underline underline-offset-4"
          >
            Request a new reset link
          </a>
        </div>
      ) : success ? (
        <div className="mt-8 rounded-sm border border-[#0b7a4b]/25 bg-[#0b7a4b]/5 p-4 text-center text-[13px] text-[#0b7a4b]">
          {message} Redirecting to sign in…
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
            >
              New Password
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => setPasswordTouched(true)}
                className="w-full border border-[#ddd6ca] py-3 pl-11 pr-11 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                placeholder="Create new password"
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

            {passwordTouched && (
              <PasswordChecklist password={password} />
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#60716e]"
              />

              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="w-full border border-[#ddd6ca] py-3 pl-11 pr-11 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                placeholder="Confirm new password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#60716e] transition-colors hover:text-[#103f35]"
              >
                {showConfirmPassword ? (
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
            {isPending ? "Updating..." : "Update Password"}
          </button>

          {message && (
            <p className="text-center text-[13px] font-medium text-[#b42318]">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
