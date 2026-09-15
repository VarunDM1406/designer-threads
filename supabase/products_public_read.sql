-- Run this once in the Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql/new)
--
-- CRITICAL FIX: the `products` table currently has no policy allowing
-- anonymous/public visitors to read it. Right now, the shop, search,
-- homepage, and every product page return zero products for anyone who
-- isn't logged in — i.e. the storefront is invisible to real customers.
-- (categories, collections, and product_images are already publicly
-- readable — only `products` itself is missing this.)
--
-- This adds a permissive SELECT policy for active products, without
-- touching any existing admin policies (Postgres RLS combines multiple
-- policies for the same action with OR).

drop policy if exists "Public can view active products" on public.products;

create policy "Public can view active products"
  on public.products
  for select
  using (is_active = true);

-- Same gap likely affects product_variants (used for size/color options).
drop policy if exists "Public can view active product variants" on public.product_variants;

create policy "Public can view active product variants"
  on public.product_variants
  for select
  using (is_active is not false);
