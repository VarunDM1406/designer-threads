export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface OrderItem {
  id: string;
  product_variant_id: string | null;
  product_name: string;
  product_sku: string;
  size: string | null;
  color: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}
export interface OrderProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export interface ShippingAddress {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}
export interface Order {
  id: string;

  order_number: string;

  customer_name: string;

  customer_email: string | null;

  customer_phone: string;

  subtotal: number;

  discount: number;

  shipping_charge: number;

  total: number;

  payment_method: string | null;

  payment_status: PaymentStatus;

  status: OrderStatus;

  tracking_number: string | null;

  notes: string | null;

  created_at: string;

  updated_at: string;

  order_items?: OrderItem[]
  profile: OrderProfile | null;

shipping_address: ShippingAddress | null;
}