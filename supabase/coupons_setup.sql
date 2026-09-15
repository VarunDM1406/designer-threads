-- Run this once in the Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql/new)
--
-- Coupons existed only as an admin CRUD feature — there was no way for a
-- customer to ever apply one at checkout, and (like `products` before)
-- the `coupons` table has no public-read policy either. This adds:
--   1. columns on `orders` to record which coupon (if any) was used
--   2. a public read policy for active coupons, so checkout can look up
--      a code a customer types in

alter table public.orders
  add column if not exists coupon_id uuid references public.coupons(id),
  add column if not exists coupon_code text;

drop policy if exists "Public can view active coupons" on public.coupons;

create policy "Public can view active coupons"
  on public.coupons
  for select
  using (is_active = true);
