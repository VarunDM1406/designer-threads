"use client";

import { useTransition } from "react";
import { logout } from "../actions/logout";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logout();
      window.location.href = "/";
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleLogout}
      className="border border-[#ddd6ca] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35] transition-colors hover:bg-[#f4f0e8] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
