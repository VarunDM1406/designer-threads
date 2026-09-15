"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?next=/account/edit");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("PROFILE LOAD ERROR:", error);
        setError("Failed to load your profile.");
        setLoading(false);
        return;
      }

      setForm({
        firstName:
          profile?.first_name ??
          user.user_metadata?.first_name ??
          "",

        lastName:
          profile?.last_name ??
          user.user_metadata?.last_name ??
          "",

        phone: profile?.phone ?? "",
      });

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?next=/account/edit");
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim(),
        })
        .eq("auth_user_id", user.id);

      if (updateError) {
        console.error(
          "PROFILE UPDATE ERROR:",
          updateError
        );

        setError(updateError.message);
        return;
      }

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        router.push("/account");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error("PROFILE UPDATE ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

        <main className="min-h-screen bg-white px-6 py-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-[13px] text-[#60716e]">
              Loading your profile...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="h-[calc(110px+var(--announcement-h,0px))]" aria-hidden="true" />

      <main className="min-h-screen bg-white px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => router.push("/account")}
              className="text-[13px] text-[#60716e] transition-colors hover:text-[#103f35]"
            >
              ← Back to Account
            </button>

            <p className="mt-8 text-[9px] font-medium uppercase tracking-[0.25em] text-[#a87932]">
              My Account
            </p>

            <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#103f35]">
              Edit Profile
            </h1>

            <p className="mt-2 text-[13px] text-[#60716e]">
              Update your personal information.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border border-[#ddd6ca] bg-white p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  First Name
                </label>

                <input
                  type="text"
                  value={form.firstName}
                  onChange={(event) =>
                    updateField(
                      "firstName",
                      event.target.value
                    )
                  }
                  required
                  className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  Last Name
                </label>

                <input
                  type="text"
                  value={form.lastName}
                  onChange={(event) =>
                    updateField(
                      "lastName",
                      event.target.value
                    )
                  }
                  required
                  className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                Phone
              </label>

              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="+91 XXXXX XXXXX"
                className="w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
              />
            </div>

            {error && (
              <div className="mt-5 border border-[#b42318]/20 bg-[#b42318]/5 p-4 text-[13px] text-[#b42318]">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 border border-[#0d4037]/20 bg-[#0d4037]/5 p-4 text-[13px] text-[#0d4037]">
                {success}
              </div>
            )}

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/account")}
                className="border border-[#ddd6ca] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35] transition-colors hover:bg-[#f4f0e8]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="bg-[#103f35] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
