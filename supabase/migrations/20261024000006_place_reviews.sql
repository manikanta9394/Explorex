-- Migration: Place Reviews Table and Moderation Policies
-- Version: 20261024000006

create table if not exists public.place_reviews (
  id uuid primary key default gen_random_uuid(),
  place_id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  user_name text not null default 'Explorer',
  user_avatar text,
  rating smallint not null check (rating between 1 and 5),
  comment text not null,
  status text not null default 'approved' check (status in ('pending', 'approved', 'flagged', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_user_place_review unique (place_id, user_id)
);

create index if not exists place_reviews_place_idx on public.place_reviews (place_id);
create index if not exists place_reviews_user_idx on public.place_reviews (user_id);
create index if not exists place_reviews_status_idx on public.place_reviews (status);

-- Enable Row Level Security
alter table public.place_reviews enable row level security;

-- Policies:
-- 1. Anyone can view approved reviews
create policy "Anyone can view approved reviews"
  on public.place_reviews for select
  using (status = 'approved' or auth.uid() = user_id or public.is_admin());

-- 2. Authenticated users can insert their own review (one per place enforced by unique constraint)
create policy "Authenticated users can submit a review"
  on public.place_reviews for insert
  with check (auth.uid() = user_id);

-- 3. Users can update their own review
create policy "Users can update their own review"
  on public.place_reviews for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- 4. Users can delete their own review; admin can delete any review
create policy "Users can delete own review or admin can delete any"
  on public.place_reviews for delete
  using (auth.uid() = user_id or public.is_admin());
