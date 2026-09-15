"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useCart } from "@/features/cart/context/cart-context";
import { createOrder } from "@/features/checkout/actions/create-order";
import { createClient } from "@/lib/supabase/client";
import { calculateShipping } from "@/lib/shipping";
import { buildOrderWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import CouponField from "@/features/coupons/components/coupon-field";
import { useShippingConfig } from "@/features/settings/hooks/use-shipping-config";

function CheckoutHeader() {
  return (
    <div className="border-b border-[#ddd6ca] bg-white px-6 py-5">
      <Link
        href="/"
        className="mx-auto flex w-fit items-center gap-3"
      >
        <Image
          src="/images/logos/dt-logo.jpeg"
          alt="Designer Threads"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />

        <span className="font-serif text-[17px] tracking-[-0.02em] text-[#103f35]">
          Designer Threads
        </span>
      </Link>
    </div>
  );
}

type CustomerForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
};

export default function CheckoutPage() {
  const { items, subtotal, discount, appliedCoupon, clearCart } = useCart();

  const [form, setForm] = useState<CustomerForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [profileId, setProfileId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { shippingCharge, freeShippingThreshold } = useShippingConfig();

  const shipping = calculateShipping(
    Number(subtotal),
    shippingCharge,
    freeShippingThreshold
  );
  const tax: number = 0;

  const total =
    Number(subtotal) -
    Number(discount) +
    Number(shipping) +
    Number(tax);

  /*
   * LOAD LOGGED-IN CUSTOMER
   */
  useEffect(() => {
    async function loadCustomer() {
      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoadingProfile(false);
          return;
        }

        /*
         * LOAD PROFILE
         */
        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select(`
              id,
              first_name,
              last_name,
              email,
              phone
            `)
            .eq("auth_user_id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "PROFILE LOAD ERROR:",
            profileError
          );
        }

        setProfileId(profile?.id ?? null);

        /*
         * LOAD SAVED ADDRESS
         */
        let savedAddress: {
          full_name: string | null;
          phone: string | null;
          address_line_1: string | null;
          address_line_2: string | null;
          landmark: string | null;
          city: string | null;
          state: string | null;
          country: string | null;
          postal_code: string | null;
          is_default: boolean | null;
        } | null = null;

        if (profile?.id) {
          const { data: address, error: addressError } =
            await supabase
              .from("addresses")
              .select(`
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
              })
              .limit(1)
              .maybeSingle();

          if (addressError) {
            console.error(
              "ADDRESS LOAD ERROR:",
              addressError
            );
          } else {
            savedAddress = address;
          }
        }

        /*
         * SPLIT SAVED ADDRESS NAME
         */
        let addressFirstName = "";
        let addressLastName = "";

        if (savedAddress?.full_name) {
          const nameParts =
            savedAddress.full_name
              .trim()
              .split(/\s+/);

          addressFirstName =
            nameParts[0] ?? "";

          addressLastName =
            nameParts.slice(1).join(" ");
        }

        /*
         * FILL FORM
         */
        setForm((current) => ({
          ...current,

          firstName:
            profile?.first_name ||
            addressFirstName ||
            user.user_metadata?.first_name ||
            "",

          lastName:
            profile?.last_name ||
            addressLastName ||
            user.user_metadata?.last_name ||
            "",

          email:
            profile?.email ||
            user.email ||
            "",

          phone:
            profile?.phone ||
            savedAddress?.phone ||
            "",

          address:
            savedAddress?.address_line_1 ||
            "",

          city:
            savedAddress?.city ||
            "",

          state:
            savedAddress?.state ||
            "",

          postalCode:
            savedAddress?.postal_code ||
            "",
        }));
      } catch (error) {
        console.error(
          "CUSTOMER LOAD ERROR:",
          error
        );
      } finally {
        setLoadingProfile(false);
      }
    }

    loadCustomer();
  }, []);

  /*
   * UPDATE FORM FIELD
   */
  function updateField(
    field: keyof CustomerForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
   * PLACE ORDER
   */
  async function handlePlaceOrder() {
    setError("");

    const requiredFields: (keyof CustomerForm)[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "postalCode",
    ];

    const missingField =
      requiredFields.find(
        (field) => !form[field].trim()
      );

    if (missingField) {
      setError(
        "Please fill in all delivery details."
      );
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      /*
       * GET CURRENT USER
       */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "Please login before placing your order."
        );
      }

      /*
       * GET CUSTOMER PROFILE
       */
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

      if (profileError) {
        console.error(
          "PROFILE ERROR:",
          profileError
        );

        throw new Error(
          "Failed to load your customer profile."
        );
      }

      if (!profile) {
        throw new Error(
          "Customer profile not found."
        );
      }

      /*
       * CREATE ORDER
       */
      const result = await createOrder({
        profileId: profile.id,

        address: {
          full_name:
            `${form.firstName} ${form.lastName}`.trim(),

          phone: form.phone,

          address_line_1:
            form.address,

          city: form.city,

          state: form.state,

          country: "India",

          postal_code:
            form.postalCode,
        },

        items: items.map((item) => ({
          product_variant_id:
            (item as any).variantId ??
            (item as any).product_variant_id ??
            null,

          product_name:
            item.name,

          product_sku:
            (item as any).sku ??
            (item as any).product_sku ??
            item.id,

          size:
            (item as any).size ??
            null,

          color:
            (item as any).color ??
            null,

          unit_price:
            Number(item.price),

          quantity:
            Number(item.quantity),
        })),

        payment_method: "whatsapp",

        coupon_code: appliedCoupon?.code,

        customer_note: undefined,
      });

      if (!result || !result.success) {
        throw new Error(
          (result && "message" in result && result.message) ||
            "Failed to create your order."
        );
      }

      /*
       * BUILD WHATSAPP CONFIRMATION MESSAGE
       */
      const whatsappMessage = buildOrderWhatsAppMessage({
        orderNumber: result.orderNumber,

        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          unitPrice: Number(item.price),
        })),

        subtotal: Number(subtotal),
        shipping,
        discount: result.discount,
        couponCode: appliedCoupon?.code,
        total: result.total,

        customerName: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
      });

      const whatsappUrl = getWhatsAppUrl(whatsappMessage);

      /*
       * CLEAR CART
       */
      clearCart();

      /*
       * HAND OFF TO WHATSAPP TO CONFIRM THE ORDER
       */
      window.location.href =
        whatsappUrl ||
        `/order-success?order=${result.orderId}`;
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * EMPTY CART
   */
  if (items.length === 0) {
    return (
      <>
        <CheckoutHeader />

        <main className="min-h-screen bg-white p-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
              Checkout
            </h1>

            <div className="mt-8 border border-[#ddd6ca] bg-white p-10 text-center">
              <h2 className="font-serif text-xl text-[#103f35]">
                Your cart is empty
              </h2>

              <p className="mt-2 text-[13px] text-[#60716e]">
                Add some pieces before proceeding
                to checkout.
              </p>

              <Link
                href="/shop"
                className="mt-6 inline-block bg-[#103f35] px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  /*
   * CHECKOUT PAGE
   */
  return (
    <>
      <CheckoutHeader />

      <main className="min-h-screen bg-white p-6 sm:p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="font-serif text-3xl tracking-[-0.03em] text-[#103f35]">
          Checkout
        </h1>

        <p className="mt-1 text-[13px] text-[#60716e]">
          Complete your order.
        </p>

        {loadingProfile && (
          <div className="mt-6 border border-[#ddd6ca] bg-white p-4 text-[13px] text-[#60716e]">
            Loading your details...
          </div>
        )}

        {error && (
          <div className="mt-6 border border-[#b42318]/25 bg-[#b42318]/5 p-4 text-[13px] text-[#b42318]">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">

          {/* CUSTOMER DETAILS */}

          <section className="border border-[#ddd6ca] bg-white p-6">

            <h2 className="font-serif text-lg text-[#103f35]">
              Customer Details
            </h2>

            <div className="mt-6 grid gap-5">

              {/* FIRST + LAST NAME */}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                    First Name
                  </label>

                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      updateField(
                        "firstName",
                        e.target.value
                      )
                    }
                    type="text"
                    placeholder="First name"
                    className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                    Last Name
                  </label>

                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      updateField(
                        "lastName",
                        e.target.value
                      )
                    }
                    type="text"
                    placeholder="Last name"
                    className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                  />
                </div>

              </div>

              {/* EMAIL */}

              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  Email
                </label>

                <input
                  value={form.email}
                  readOnly
                  type="email"
                  className="mt-2 w-full border border-[#ddd6ca] bg-[#f4f0e8] px-4 py-3 text-[14px] text-[#60716e] outline-none"
                />
              </div>

              {/* PHONE */}

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
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>

              {/* ADDRESS */}

              <div>
                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                  Address
                </label>

                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateField(
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="Complete delivery address"
                  rows={4}
                  className="mt-2 w-full resize-none border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                />
              </div>

              {/* CITY STATE PIN */}

              <div className="grid gap-5 sm:grid-cols-3">

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
                    type="text"
                    placeholder="City"
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
                      updateField(
                        "state",
                        e.target.value
                      )
                    }
                    type="text"
                    placeholder="State"
                    className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#103f35]">
                    PIN Code
                  </label>

                  <input
                    value={form.postalCode}
                    onChange={(e) =>
                      updateField(
                        "postalCode",
                        e.target.value
                      )
                    }
                    type="text"
                    placeholder="PIN Code"
                    className="mt-2 w-full border border-[#ddd6ca] px-4 py-3 text-[14px] text-[#1f1f1f] outline-none focus:border-[#103f35]"
                  />
                </div>

              </div>

            </div>
          </section>

          {/* ORDER SUMMARY */}

          <aside className="h-fit border border-[#ddd6ca] bg-white p-6">

            <h2 className="font-serif text-lg text-[#103f35]">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4"
                >
                  <div>
                    <p className="text-[13px] font-medium text-[#171717]">
                      {item.name}
                    </p>

                    <p className="text-[12px] text-[#60716e]">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-[13px] font-medium text-[#171717]">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}

            </div>

            <div className="mt-6 space-y-3 border-t border-[#ddd6ca] pt-5 text-[13px]">

              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Subtotal
                </span>

                <span className="text-[#171717]">
                  ₹
                  {Number(subtotal).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#60716e]">
                  Shipping
                </span>

                <span className="text-[#171717]">
                  {shipping === 0
                    ? "Free"
                    : `₹${Number(shipping).toLocaleString("en-IN")}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-[#60716e]">
                    Discount
                  </span>

                  <span className="text-[#0d4037]">
                    −₹{discount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <CouponField profileId={profileId} />

              <div className="border-t border-[#ddd6ca] pt-4">

                <div className="flex justify-between text-[16px] font-semibold text-[#103f35]">

                  <span>
                    Total
                  </span>

                  <span>
                    ₹
                    {Number(total).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                loading ||
                loadingProfile
              }
              className="mt-6 w-full bg-[#103f35] px-5 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#0b2b21] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Placing Order..."
                : "Confirm Order on WhatsApp"}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-[#60716e]">
              You&apos;ll be taken to WhatsApp to confirm your order
              details with us. Payment is arranged directly over chat —
              cash on delivery is not available.
            </p>

          </aside>

        </div>
      </div>
      </main>
    </>
  );
}