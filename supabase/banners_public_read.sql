-- Run this once in the Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql/new)
--
-- Same gap as products/coupons: the `banners` table has no policy letting
-- anonymous visitors read it, so admin-created banners are invisible on
-- the storefront until this is added.

drop policy if exists "Public can view active banners" on public.banners;

create policy "Public can view active banners"
  on public.banners
  for select
  using (is_active = true);
