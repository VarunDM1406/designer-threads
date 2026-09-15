import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import EditProfile from "./edit-profile";
import AddressManager from "@/features/account/components/address-manager";
import LogoutButton from "@/features/auth/components/logout-button";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone
      `)
      .eq("auth_user_id", user.id)
      .maybeSingle();

  if (profileError) {
    console.error(
      "ACCOUNT PROFILE ERROR:",
      profileError
    );
  }

  if (!profile) {
    redirect("/login?next=/account");
  }

  const { data: addresses, error: addressError } =
    await supabase
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
      .eq("profile_id", profile.id)
      .order("is_default", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

  if (addressError) {
    console.error(
      "ACCOUNT ADDRESS ERROR:",
      addressError
    );
  }

  const fullName =
    `${profile.first_name ?? ""} ${
      profile.last_name ?? ""
    }`.trim() || "Customer";

  const email =
    profile.email ??
    user.email ??
    "";

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              My Account
            </p>

            <h1 className="mt-3 font-serif text-4xl tracking-[-0.03em] text-[#103f35]">
              Welcome, {fullName}
            </h1>

            <p className="mt-2 text-[13px] text-[#60716e]">
              Manage your account and view your orders.
            </p>
          </div>

          {/* Profile + Orders */}
          <div className="grid gap-6 md:grid-cols-2">

            <EditProfile
              profileId={profile.id}
              firstName={profile.first_name ?? ""}
              lastName={profile.last_name ?? ""}
              email={email}
              phone={profile.phone ?? ""}
            />

            <section className="border border-[#ddd6ca] bg-white p-6">
              <h2 className="font-serif text-lg text-[#103f35]">
                Orders
              </h2>

              <p className="mt-2 text-[13px] text-[#60716e]">
                View your previous orders and track their status.
              </p>

              <Link
                href="/orders"
                className="mt-6 inline-flex bg-[#103f35] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
              >
                View My Orders
              </Link>
            </section>

          </div>

          {/* Saved Addresses */}
          <AddressManager
            initialAddresses={addresses ?? []}
          />

          {/* Account Actions */}
          <section className="mt-6 border border-[#ddd6ca] bg-white p-6">
            <h2 className="font-serif text-lg text-[#103f35]">
              Account
            </h2>

            <div className="mt-5">
              <LogoutButton />
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}
