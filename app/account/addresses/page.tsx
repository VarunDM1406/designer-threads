import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function AddressesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account/addresses");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!profile) {
    redirect("/account");
  }

  const { data: addresses, error } = await supabase
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
      is_default,
      created_at
    `)
    .eq("profile_id", profile.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("ADDRESSES LOAD ERROR:", error);
  }

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-4xl">

          <Link
            href="/account"
            className="text-[13px] text-[#60716e] transition-colors hover:text-[#103f35]"
          >
            ← Back to Account
          </Link>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
                My Account
              </p>

              <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#103f35]">
                My Addresses
              </h1>

              <p className="mt-2 text-[13px] text-[#60716e]">
                Manage your saved delivery addresses.
              </p>
            </div>

            <Link
              href="/account"
              className="bg-[#103f35] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0b2b21]"
            >
              Add Address
            </Link>
          </div>

          <div className="mt-8 space-y-5">
            {!addresses || addresses.length === 0 ? (
              <section className="border border-[#ddd6ca] bg-white p-8 text-center">
                <h2 className="font-serif text-xl text-[#103f35]">
                  No saved addresses
                </h2>

                <p className="mt-2 text-[13px] text-[#60716e]">
                  Add an address to make checkout faster.
                </p>

                <Link
                  href="/account"
                  className="mt-6 inline-flex bg-[#103f35] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
                >
                  Add Your First Address
                </Link>
              </section>
            ) : (
              addresses.map((address) => (
                <section
                  key={address.id}
                  className="border border-[#ddd6ca] bg-white p-6"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-[14px] font-semibold text-[#171717]">
                          {address.full_name}
                        </h2>

                        {address.is_default && (
                          <span className="bg-[#103f35] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-white">
                            Default
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-[13px] text-[#60716e]">
                        {address.address_line_1}
                      </p>

                      {address.address_line_2 && (
                        <p className="text-[13px] text-[#60716e]">
                          {address.address_line_2}
                        </p>
                      )}

                      {address.landmark && (
                        <p className="text-[13px] text-[#60716e]">
                          Landmark: {address.landmark}
                        </p>
                      )}

                      <p className="mt-1 text-[13px] text-[#60716e]">
                        {address.city}, {address.state}{" "}
                        {address.postal_code}
                      </p>

                      <p className="text-[13px] text-[#60716e]">
                        {address.country}
                      </p>

                      <p className="mt-3 text-[13px] text-[#60716e]">
                        Phone: {address.phone}
                      </p>
                    </div>

                    <Link
                      href={`/account/addresses/${address.id}/edit`}
                      className="shrink-0 border border-[#ddd6ca] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35] transition-colors hover:bg-[#f4f0e8]"
                    >
                      Edit
                    </Link>
                  </div>
                </section>
              ))
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
