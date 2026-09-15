"use client";

import { useTransition } from "react";
import { logout } from "../actions/logout";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          logout();
        });
      }}
      className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
    >
      {isPending ? "Logging out..." : "Log out"}
    </button>
  );
}