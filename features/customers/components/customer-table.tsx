"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Customer } from "../types/customer";

type Props = {
  customers: Customer[];
};

export default function CustomerTable({ customers }: Props) {
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return customers;

    return customers.filter((customer) => {
      const name =
        `${customer.first_name ?? ""} ${customer.last_name ?? ""}`
          .trim()
          .toLowerCase();

      return (
        name.includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phone?.toLowerCase().includes(query)
      );
    });
  }, [customers, search]);

  return (
    <div className="rounded-2xl border bg-white">
      <div className="border-b p-4">
        <input
          type="text"
          placeholder="Search customer, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((customer) => {
              const name =
                `${customer.first_name ?? ""} ${customer.last_name ?? ""}`
                  .trim() || "Unnamed Customer";

              return (
                <tr key={customer.id} className="border-b">
                  <td className="px-4 py-4 font-medium">
                    {name}
                  </td>

                  <td className="px-4 py-4">
                    {customer.email || "Not provided"}
                  </td>

                  <td className="px-4 py-4">
                    {customer.phone || "Not provided"}
                  </td>

                  <td className="px-4 py-4">
                    {new Date(customer.created_at).toLocaleDateString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Link
                      href={`/admin/customers/${customer.id}`}
                      className="rounded-lg border px-3 py-1.5"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No customers found.
        </div>
      )}
    </div>
  );
}