-- Run this once in the Supabase SQL Editor
-- (https://supabase.com/dashboard/project/enpdqxvcjuxhsrcofzfu/sql/new)
--
-- store_settings currently only allows admins to read it, but shipping
-- charge / free-shipping threshold need to be visible on the public
-- storefront (cart, checkout, product pages) so shipping is controlled
-- from one place (Settings) instead of hardcoded per-page. Admin-only
-- write access is untouched — this only adds public SELECT.

drop policy if exists "Public can view store settings" on public.store_settings;

create policy "Public can view store settings"
  on public.store_settings
  for select
  using (true);
