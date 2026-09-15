"use client";

import { useState } from "react";

import {
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/features/account/actions/address-actions";

type Address = {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
};

type AddressManagerProps = {
  initialAddresses: Address[];
};

export default function AddressManager({
  initialAddresses,
}: AddressManagerProps) {
  const [addresses, setAddresses] =
    useState<Address[]>(initialAddresses);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    landmark: "",
    city: "",
    state: "",
    postal_code: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleAddAddress() {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await addAddress({
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

      if (!result.success) {
        throw new Error("Failed to add address.");
      }

      /*
       * Reload addresses from the server so the new
       * address and default state are accurate.
       */
      window.location.reload();
    } catch (err) {
      console.error("ADD ADDRESS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to add address."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(addressId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    setActionId(addressId);
    setError("");
    setSuccess("");

    try {
      await deleteAddress(addressId);

      setAddresses((current) =>
        current.filter((address) => address.id !== addressId)
      );

      setSuccess("Address deleted successfully.");
    } catch (err) {
      console.error("DELETE ADDRESS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete address."
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleSetDefault(addressId: string) {
    setActionId(addressId);
    setError("");
    setSuccess("");

    try {
      await setDefaultAddress(addressId);

      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          is_default: address.id === addressId,
        }))
      );

      setSuccess("Default address updated.");
    } catch (err) {
      console.error("DEFAULT ADDRESS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update default address."
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="mt-6 border border-[#ddd6ca] bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg text-[#103f35]">
            Saved Addresses
          </h2>

          <p className="mt-2 text-[13px] text-[#60716e]">
            Manage your delivery addresses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
            setSuccess("");
          }}
          className="bg-[#103f35] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#0b2b21]"
        >
          {showForm ? "Cancel" : "Add Address"}
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="mt-5 border border-[#0d4037]/20 bg-[#0d4037]/5 px-4 py-3 text-[13px] text-[#0d4037]">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-5 border border-[#b42318]/20 bg-[#b42318]/5 px-4 py-3 text-[13px] text-[#b42318]">
          {error}
        </div>
      )}

      {/* Add Address Form */}
      {showForm && (
        <div className="mt-6 border border-[#ddd6ca] bg-[#f4f0e8] p-5">
          <h3 className="font-serif text-base text-[#103f35]">
            Add New Address
          </h3>

          <div className="mt-5 space-y-4">

            {/* Name + Phone */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  Full Name
                </label>

                <input
                  value={form.full_name}
                  onChange={(e) =>
                    updateField(
                      "full_name",
                      e.target.value
                    )
                  }
                  placeholder="Full name"
                  className="mt-2 w-full border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  Phone
                </label>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    updateField(
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-2 w-full border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                Address
              </label>

              <textarea
                value={form.address_line_1}
                onChange={(e) =>
                  updateField(
                    "address_line_1",
                    e.target.value
                  )
                }
                placeholder="House / Flat / Street"
                rows={3}
                className="mt-2 w-full resize-none border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                Address Line 2
              </label>

              <input
                value={form.address_line_2}
                onChange={(e) =>
                  updateField(
                    "address_line_2",
                    e.target.value
                  )
                }
                placeholder="Apartment, block, floor etc. (optional)"
                className="mt-2 w-full border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
              />
            </div>

            {/* Landmark */}
            <div>
              <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                Landmark
              </label>

              <input
                value={form.landmark}
                onChange={(e) =>
                  updateField(
                    "landmark",
                    e.target.value
                  )
                }
                placeholder="Nearby landmark (optional)"
                className="mt-2 w-full border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
              />
            </div>

            {/* City / State / PIN */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  City
                </label>

                <input
                  value={form.city}
                  onChange={(e) =>
                    updateField(
                      "city",
                      e.target.value
                    )
                  }
                  placeholder="City"
                  className="mt-2 w-full border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  State
                </label>

                <input
                  value={form.state}
                  onChange={(e) =>
                    updateField(
                      "state",
                      e.target.value
                    )
                  }
                  placeholder="State"
                  className="mt-2 w-full border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  PIN Code
                </label>

                <input
                  value={form.postal_code}
                  onChange={(e) =>
                    updateField(
                      "postal_code",
                      e.target.value
                    )
                  }
                  placeholder="PIN Code"
                  className="mt-2 w-full border border-[#ddd6ca] bg-white px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddAddress}
              disabled={
                loading ||
                !form.full_name.trim() ||
                !form.phone.trim() ||
                !form.address_line_1.trim() ||
                !form.city.trim() ||
                !form.state.trim() ||
                !form.postal_code.trim()
              }
              className="bg-[#103f35] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="mt-6 space-y-4">
        {addresses.length === 0 ? (
          <div className="border border-dashed border-[#ddd6ca] p-8 text-center">
            <p className="text-[14px] font-medium text-[#103f35]">
              No saved addresses
            </p>

            <p className="mt-1 text-[13px] text-[#60716e]">
              Add an address to make checkout faster.
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className="border border-[#ddd6ca] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#171717]">
                      {address.full_name}
                    </p>

                    {address.is_default && (
                      <span className="bg-[#103f35] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-white">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-[13px] text-[#60716e]">
                    {address.phone}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-[13px] leading-6 text-[#60716e]">
                <p>{address.address_line_1}</p>

                {address.address_line_2 && (
                  <p>{address.address_line_2}</p>
                )}

                {address.landmark && (
                  <p>Near {address.landmark}</p>
                )}

                <p>
                  {address.city}, {address.state}{" "}
                  {address.postal_code}
                </p>

                <p>{address.country}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {!address.is_default && (
                  <button
                    type="button"
                    disabled={actionId === address.id}
                    onClick={() =>
                      handleSetDefault(address.id)
                    }
                    className="border border-[#ddd6ca] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35] transition-colors hover:bg-[#f4f0e8] disabled:opacity-50"
                  >
                    {actionId === address.id
                      ? "Updating..."
                      : "Set as Default"}
                  </button>
                )}

                <button
                  type="button"
                  disabled={actionId === address.id}
                  onClick={() =>
                    handleDelete(address.id)
                  }
                  className="border border-[#b42318]/25 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#b42318] transition-colors hover:bg-[#b42318]/5 disabled:opacity-50"
                >
                  {actionId === address.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
