-- Run this once in the Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql/new)
-- to enable the admin Settings page to persist data.

create table if not exists public.store_settings (
  id integer primary key default 1,
  store_name text default '',
  store_email text default '',
  store_phone text default '',
  whatsapp_number text default '',
  store_description text default '',
  store_address text default '',
  instagram_url text default '',
  website_url text default '',
  shipping_charge numeric default 0,
  free_shipping_above numeric default 0,
  minimum_order_value numeric default 0,
  tax_percent numeric default 0,
  admin_name text default '',
  admin_email text default '',
  updated_at timestamptz default now(),
  constraint store_settings_singleton check (id = 1)
);

insert into public.store_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.store_settings enable row level security;

drop policy if exists "Admins can view settings" on public.store_settings;
create policy "Admins can view settings"
  on public.store_settings
  for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.auth_user_id = auth.uid()
        and profiles.role = 'admin'
    )
  );

drop policy if exists "Admins can update settings" on public.store_settings;
create policy "Admins can update settings"
  on public.store_settings
  for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.auth_user_id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.auth_user_id = auth.uid()
        and profiles.role = 'admin'
    )
  );
