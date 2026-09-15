"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { updateAddress } from "../actions/address-actions";

type EditAddressFormProps = {
  address?: {
    id: string;
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string | null;
    landmark?: string | null;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  } | null;
};

export default function EditAddressForm({
  address,
}: EditAddressFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: address?.full_name ?? "",
    phone: address?.phone ?? "",
    address_line_1: address?.address_line_1 ?? "",
    address_line_2: address?.address_line_2 ?? "",
    landmark: address?.landmark ?? "",
    city: address?.city ?? "",
    state: address?.state ?? "",
    postal_code: address?.postal_code ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  async function handleSave() {
    if (!address) return;

    setSaving(true);
    setError("");

    try {
      await updateAddress(address.id, {
        full_name: form.full_name,
        phone: form.phone,
        address_line_1: form.address_line_1,
        address_line_2: form.address_line_2,
        landmark: form.landmark,
        city: form.city,
        state: form.state,
        postal_code: form.postal_code,
        country: "India",
      });

      router.push("/account/addresses");
      router.refresh();
    } catch (err) {
      console.error("UPDATE ADDRESS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update address."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!address) {
    return (
      <div className="mt-8 border border-[#ddd6ca] bg-white p-8 text-center">
        <p className="text-[13px] text-[#60716e]">
          Address not found.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 border border-[#ddd6ca] bg-white p-6 sm:p-8">
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              Full Name
            </label>

            <input
              value={form.full_name}
              onChange={(e) =>
                updateField("full_name", e.target.value)
              }
              className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(e) =>
                updateField("phone", e.target.value)
              }
              className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
            Address
          </label>

          <textarea
            value={form.address_line_1}
            onChange={(e) =>
              updateField("address_line_1", e.target.value)
            }
            rows={3}
            className="mt-2 w-full resize-none border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
            Address Line 2
          </label>

          <input
            value={form.address_line_2}
            onChange={(e) =>
              updateField("address_line_2", e.target.value)
            }
            placeholder="Apartment, block, floor etc. (optional)"
            className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
            Landmark
          </label>

          <input
            value={form.landmark}
            onChange={(e) =>
              updateField("landmark", e.target.value)
            }
            placeholder="Nearby landmark (optional)"
            className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              City
            </label>

            <input
              value={form.city}
              onChange={(e) =>
                updateField("city", e.target.value)
              }
              className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              State
            </label>

            <input
              value={form.state}
              onChange={(e) =>
                updateField("state", e.target.value)
              }
              className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
              PIN Code
            </label>

            <input
              value={form.postal_code}
              onChange={(e) =>
                updateField("postal_code", e.target.value)
              }
              className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
            />
          </div>
        </div>

        {error && (
          <div className="border border-[#b42318]/20 bg-[#b42318]/5 p-4 text-[13px] text-[#b42318]">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/account/addresses")}
            className="border border-[#ddd6ca] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35] transition-colors hover:bg-[#f4f0e8]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              !form.full_name.trim() ||
              !form.phone.trim() ||
              !form.address_line_1.trim() ||
              !form.city.trim() ||
              !form.state.trim() ||
              !form.postal_code.trim()
            }
            className="bg-[#103f35] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
