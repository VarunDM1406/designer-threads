import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-neutral-200 bg-white px-8">
      <div>
        <h2 className="text-2xl font-bold">
          Dashboard
        </h2>

        <p className="text-sm text-neutral-500">
          Welcome back 👋
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="rounded-xl border p-3 hover:bg-neutral-100">
          <Search size={18} />
        </button>

        <button className="rounded-xl border p-3 hover:bg-neutral-100">
          <Bell size={18} />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black font-semibold text-white">
          V
        </div>
      </div>
    </header>
  );
}