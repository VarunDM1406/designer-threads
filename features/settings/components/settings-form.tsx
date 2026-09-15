"use client";

import { useState, useTransition } from "react";

import { updateSettings } from "../actions/update-settings";
import type { StoreSettings } from "../types/settings";

type Props = {
  initialData: StoreSettings;
};

export default function SettingsForm({ initialData }: Props) {
  const [form, setForm] = useState<StoreSettings>(initialData);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function updateField<K extends keyof StoreSettings>(
    field: K,
    value: StoreSettings[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    startTransition(async () => {
      const result = await updateSettings(form);
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Store Settings */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-xl font-semibold">Store Settings</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Basic information about your store.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Store Name
            </label>

            <input
              type="text"
              value={form.store_name}
              onChange={(e) => updateField("store_name", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Store Email
            </label>

            <input
              type="email"
              value={form.store_email}
              onChange={(e) => updateField("store_email", e.target.value)}
              placeholder="store@example.com"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              type="tel"
              value={form.store_phone}
              onChange={(e) => updateField("store_phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              WhatsApp Number
            </label>

            <input
              type="tel"
              value={form.whatsapp_number}
              onChange={(e) =>
                updateField("whatsapp_number", e.target.value)
              }
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />

            <p className="mt-2 text-xs text-neutral-500">
              For reference only — the number customers are actually
              redirected to is set via the NEXT_PUBLIC_WHATSAPP_NUMBER
              environment variable.
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Store Description
            </label>

            <textarea
              rows={4}
              value={form.store_description}
              onChange={(e) =>
                updateField("store_description", e.target.value)
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Store Address
            </label>

            <textarea
              rows={3}
              value={form.store_address}
              onChange={(e) => updateField("store_address", e.target.value)}
              placeholder="Enter your store address"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Instagram URL
            </label>

            <input
              type="url"
              value={form.instagram_url}
              onChange={(e) => updateField("instagram_url", e.target.value)}
              placeholder="https://instagram.com/..."
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Website URL
            </label>

            <input
              type="url"
              value={form.website_url}
              onChange={(e) => updateField("website_url", e.target.value)}
              placeholder="https://..."
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>
        </div>
      </section>

      {/* Order Settings */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-xl font-semibold">Order Settings</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Configure shipping and order rules.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Shipping Charge
            </label>

            <input
              type="number"
              min="0"
              value={form.shipping_charge}
              onChange={(e) =>
                updateField("shipping_charge", Number(e.target.value))
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Free Shipping Above
            </label>

            <input
              type="number"
              min="0"
              value={form.free_shipping_above}
              onChange={(e) =>
                updateField("free_shipping_above", Number(e.target.value))
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Minimum Order Value
            </label>

            <input
              type="number"
              min="0"
              value={form.minimum_order_value}
              onChange={(e) =>
                updateField("minimum_order_value", Number(e.target.value))
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tax / GST (%)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.tax_percent}
              onChange={(e) =>
                updateField("tax_percent", Number(e.target.value))
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>
      </section>

      {/* Ordering Method */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-xl font-semibold">Ordering Method</h2>

          <p className="mt-1 text-sm text-neutral-500">
            How customers place and confirm orders.
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between rounded-xl border border-neutral-200 p-4">
            <div>
              <p className="font-medium">WhatsApp Ordering</p>

              <p className="text-sm text-neutral-500">
                Customers complete checkout on the site, then confirm
                and arrange payment with you directly over WhatsApp.
                Cash on delivery and online payments are not offered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 p-6">
          <h2 className="text-xl font-semibold">Admin Account</h2>

          <p className="mt-1 text-sm text-neutral-500">
            Manage your administrator information.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Admin Name
            </label>

            <input
              type="text"
              value={form.admin_name}
              onChange={(e) => updateField("admin_name", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Admin Email
            </label>

            <input
              type="email"
              value={form.admin_email}
              onChange={(e) => updateField("admin_email", e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-end gap-4">
        {message && (
          <p className="text-sm font-medium text-green-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
