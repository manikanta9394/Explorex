-- ============================================================================
-- Explorex Schema Migration: 20261024000007_admin_system.sql
-- Description: Admin System Infrastructure, Row Level Security, App Settings,
--              Candidate Images, and Documented Initial Admin Creation.
-- ============================================================================

-- 1. Extend Profiles Table for Admin Flags & 2-Factor Authentication (TOTP)
alter table public.profiles
  add column if not exists is_disabled boolean not null default false,
  add column if not exists totp_secret text,
  add column if not exists totp_enabled boolean not null default false;

-- 2. App Settings Table (Feature Flags, Maintenance Mode, Cost Limits)
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

-- Seed default feature flags and system settings
insert into public.app_settings (key, value)
values
  ('feature_flags', '{"guest_access": true, "reviews_enabled": true, "ai_guide_enabled": true, "emergency_sos": true}'::jsonb),
  ('maintenance_mode', '{"enabled": false, "message": "Explorex is undergoing scheduled heritage database indexing. Back online shortly."}'::jsonb),
  ('ai_settings', '{"model": "google/gemini-2.0-flash-lite", "temperature": 0.25, "rate_limit_per_min": 25, "prompt_version": "v2.4-grounded"}'::jsonb),
  ('announcement_banner', '{"is_active": false, "type": "cultural_event", "message": "Kullu Dussehra & Diwali Heritage Celebrations across India · Explore regional itineraries"}'::jsonb)
on conflict (key) do nothing;

-- 3. AI Evaluation Set Table (Ground Truth Pairs for Continuous QA)
create table if not exists public.ai_eval_items (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  ideal_answer text,
  retrieved_chunks jsonb default '[]'::jsonb,
  flagged_conversation_id uuid references public.conversations(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 4. Enable Row Level Security (RLS) on Admin Tables
alter table public.app_settings enable row level security;
alter table public.ai_eval_items enable row level security;

-- App Settings RLS:
-- Public can read feature flags and announcement banner; only admins can write.
create policy "Public can read app settings"
  on public.app_settings for select
  using (true);

create policy "Only admin can modify app settings"
  on public.app_settings for all
  using (public.is_admin())
  with check (public.is_admin());

-- AI Eval Items RLS:
create policy "Only admin can view or modify eval items"
  on public.ai_eval_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 5. DOCUMENTED INITIAL ADMIN CREATION INSTRUCTIONS
-- ============================================================================
-- NOTE ON SECURITY PRINCIPLE:
-- The first administrator CANNOT be created through the public user signup UI.
-- To grant admin access to an operator in production, run the following SQL
-- in the Supabase Dashboard SQL Editor or via database migration:
--
-- Example: Elevate an existing user account by email:
--   UPDATE public.profiles
--   SET role = 'admin'
--   WHERE id = (
--     SELECT id FROM auth.users WHERE email = 'admin@explorex.in' LIMIT 1
--   );
--
-- For local staging / automated tests, we seed the initial master admin profile:
do $$
declare
  test_admin_id uuid := 'a0000000-0000-0000-0000-000000000001'::uuid;
begin
  -- Ensure mock / staging admin user exists in profiles
  insert into public.profiles (
    id,
    display_name,
    avatar_url,
    role,
    language,
    home_state,
    is_guest,
    is_disabled,
    created_at
  ) values (
    test_admin_id,
    'Explorex Head Curator',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'admin',
    'en',
    'Telangana',
    false,
    false,
    now()
  )
  on conflict (id) do update
  set role = 'admin', is_disabled = false;
end $$;
