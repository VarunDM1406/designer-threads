"use server";

import { createClient } from "@/lib/supabase/server";
import { calculateShipping } from "@/lib/shipping";
import { validateCoupon } from "@/features/coupons/actions/validate-coupon";
import { getSettings } from "@/features/settings/actions/get-settings";

type CreateOrderInput = {
  profileId: string;

  address: {
    full_name: string;
    phone: string;
    address_line_1: string;
    address_line_2?: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };

  items: {
    product_variant_id?: string | null;
    product_name: string;
    product_sku: string;
    size?: string | null;
    color?: string | null;
    unit_price: number;
    quantity: number;
  }[];

  payment_method: string;
  coupon_code?: string;
  customer_note?: string;
};

type CreateOrderResult =
  | { success: false; message: string }
  | {
      success: true;
      orderId: string;
      orderNumber: string;
      discount: number;
      total: number;
    };

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const supabase = await createClient();

  if (!input.items.length) {
    throw new Error("Cart is empty");
  }

  const subtotal = input.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  let discount = 0;
  let couponId: string | null = null;
  let couponCode: string | null = null;

  if (input.coupon_code) {
    const couponResult = await validateCoupon(
      input.coupon_code,
      subtotal,
      input.profileId
    );

    if (!couponResult.success) {
      return {
        success: false,
        message: couponResult.message,
      };
    }

    discount = couponResult.discountAmount;
    couponId = couponResult.coupon.id;
    couponCode = couponResult.coupon.code;
  }

  const settings = await getSettings();

  const shipping_charge = calculateShipping(
    subtotal,
    settings.shipping_charge,
    settings.free_shipping_above
  );
  const tax = 0;

  const total =
    subtotal -
    discount +
    shipping_charge +
    tax;

  // 1. Create shipping address
  const { data: address, error: addressError } =
    await supabase
      .from("addresses")
      .insert({
        profile_id: input.profileId,
        full_name: input.address.full_name,
        phone: input.address.phone,
        address_line_1: input.address.address_line_1,
        address_line_2:
          input.address.address_line_2 || null,
        landmark:
          input.address.landmark || null,
        city: input.address.city,
        state: input.address.state,
        country: input.address.country,
        postal_code: input.address.postal_code,
        is_default: false,
      })
      .select("id")
      .single();

  if (addressError || !address) {
    throw new Error(
      addressError?.message ||
        "Failed to create shipping address"
    );
  }

  // 2. Generate order number
  const orderNumber = `DT-${Date.now()}`;

  // 3. Create order
  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        profile_id: input.profileId,
        shipping_address_id: address.id,

        subtotal,
        discount,
        shipping_charge,
        tax,
        total,

        payment_method: input.payment_method,
        payment_status: "pending",
        order_status: "pending",

        coupon_id: couponId,
        coupon_code: couponCode,

        customer_note:
          input.customer_note || null,
      })
      .select("id, order_number")
      .single();

  if (orderError || !order) {
    throw new Error(
      orderError?.message ||
        "Failed to create order"
    );
  }

  // 4. Create order items
  const orderItems = input.items.map((item) => ({
    order_id: order.id,

    product_variant_id:
      item.product_variant_id || null,

    product_name: item.product_name,
    product_sku: item.product_sku,

    size: item.size || null,
    color: item.color || null,

    unit_price: item.unit_price,
    quantity: item.quantity,

    total_price:
      item.unit_price * item.quantity,
  }));

  const { error: itemsError } =
    await supabase
      .from("order_items")
      .insert(orderItems);

  if (itemsError) {
    // Remove the incomplete order
    await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    throw new Error(
      itemsError.message ||
        "Failed to create order items"
    );
  }

  // 5. Record coupon usage (best-effort — doesn't block order success)
  if (couponId) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("usage_count")
      .eq("id", couponId)
      .single();

    if (coupon) {
      await supabase
        .from("coupons")
        .update({ usage_count: coupon.usage_count + 1 })
        .eq("id", couponId);
    }
  }

  return {
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
    discount,
    total,
  };
}