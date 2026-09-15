import { redirect } from "next/navigation";
import { getAdminUser } from "../actions/get-admin-user";

export default async function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}