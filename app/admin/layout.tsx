import AdminGuard from "@/features/admin/components/admin-guard";
import AdminSidebar from "@/features/admin/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-neutral-50">
        <AdminSidebar />

        <div className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
            <div>
              <h1 className="text-lg font-semibold">
                Dashboard
              </h1>

              <p className="text-xs text-neutral-500">
                Welcome back 👋
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
              V
            </div>
          </header>

          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}