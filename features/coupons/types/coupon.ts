export type CouponType = "percentage" | "fixed";

export interface Coupon {
  id: string;

  code: string;
  name: string;
  description: string | null;

  discount_type: CouponType;
  discount_value: number;

  minimum_order_amount: number;
  maximum_discount_amount: number | null;

  usage_limit: number | null;
  usage_count: number;
  per_customer_limit: number;

  starts_at: string | null;
  expires_at: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}