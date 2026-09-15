import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EditAddressForm from "@/features/account/components/edit-address-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditAddressPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/account/addresses/${id}/edit`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/account");
  }

  const { data: address, error } = await supabase
    .from("addresses")
    .select(`
      id,
      full_name,
      phone,
      address_line_1,
      address_line_2,
      landmark,
      city,
      state,
      country,
      postal_code,
      is_default
    `)
    .eq("id", id)
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (error) {
    console.error("EDIT ADDRESS LOAD ERROR:", error);
    notFound();
  }

  if (!address) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-3xl">

          <Link
            href="/account/addresses"
            className="text-[13px] text-[#60716e] transition-colors hover:text-[#103f35]"
          >
            ← Back to Addresses
          </Link>

          <div className="mt-8">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              My Account
            </p>

            <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#103f35]">
              Edit Address
            </h1>

            <p className="mt-2 text-[13px] text-[#60716e]">
              Update your delivery address.
            </p>
          </div>

          <EditAddressForm address={address} />

        </div>
      </main>

      <Footer />
    </>
  );
}
