"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavigation } from "./navigation";
import LogoutButton from "@/features/admin/components/logout-button";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="border-b border-neutral-200 p-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Designer Threads
        </h1>

        <p className="mt-1 text-sm text-neutral-500">
          Commerce Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          Main
        </p>

        <div className="space-y-1">
          {adminNavigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-black text-white shadow-md"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                <Icon size={20} />
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-neutral-200 p-5">
        <div className="rounded-xl bg-neutral-100 p-4">
          <p className="text-sm font-medium">
            Logged in as
          </p>

          <p className="mt-1 text-sm text-neutral-500">
            Varun Mittal
          </p>

          <div className="mt-3">
            <LogoutButton />
          </div>
        </div>
      </div>
    </aside>
  );
}