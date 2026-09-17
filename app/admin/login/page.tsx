import AdminLoginForm from "@/features/admin/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#0b1220] px-6 py-16"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.08), transparent 40%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.06), transparent 40%)",
      }}
    >
      <AdminLoginForm />
    </main>
  );
}
