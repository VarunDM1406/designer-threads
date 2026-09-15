-- Run this once in the Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql/new)
--
-- Adds support for text-only hero banners (no image, just a background
-- color behind the title/subtitle/CTA).

alter table public.banners
  alter column image_url drop not null;

alter table public.banners
  add column if not exists background_color text;
