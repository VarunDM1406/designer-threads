"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EditProfileProps = {
  profileId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export default function EditProfile({
  profileId,
  firstName,
  lastName,
  email,
  phone,
}: EditProfileProps) {
  const supabase = createClient();

  const [form, setForm] = useState({
    firstName,
    lastName,
    phone,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(
    field: "firstName" | "lastName" | "phone",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setMessage("");
    setError("");
  }

  async function handleSave() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          phone: form.phone.trim(),
        })
        .eq("id", profileId);

      if (error) {
        throw new Error(error.message);
      }

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="border border-[#ddd6ca] bg-white p-6">
      <h2 className="font-serif text-lg text-[#103f35]">
        Personal Information
      </h2>

      <div className="mt-6 space-y-5">
        {/* First + Last Name */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              First Name
            </label>

            <input
              value={form.firstName}
              onChange={(e) =>
                updateField("firstName", e.target.value)
              }
              className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#103f35]"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              Last Name
            </label>

            <input
              value={form.lastName}
              onChange={(e) =>
                updateField("lastName", e.target.value)
              }
              className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#103f35]"
              placeholder="Last name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
            Email
          </label>

          <input
            value={email}
            readOnly
            className="mt-2 w-full border border-[#ddd6ca] bg-[#f4f0e8] px-4 py-3 text-[14px] text-[#60716e]"
          />

          <p className="mt-2 text-[11px] text-[#60716e]">
            Email cannot be changed here.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
            Phone
          </label>

          <input
            value={form.phone}
            onChange={(e) =>
              updateField("phone", e.target.value)
            }
            className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none transition focus:border-[#103f35]"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        {/* Messages */}
        {message && (
          <div className="border border-[#0d4037]/20 bg-[#0d4037]/5 px-4 py-3 text-[13px] text-[#0d4037]">
            {message}
          </div>
        )}

        {error && (
          <div className="border border-[#b42318]/20 bg-[#b42318]/5 px-4 py-3 text-[13px] text-[#b42318]">
            {error}
          </div>
        )}

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="bg-[#103f35] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
}
