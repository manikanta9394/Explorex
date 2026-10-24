-- ============================================================================
-- Explorex Schema Migration: 20261024000001_initial_schema.sql
-- Description: Complete Postgres database schema for Explorex with Supabase Auth,
--              Row Level Security (RLS), Vector Embeddings, and Audit Logging.
-- ============================================================================

-- 1. Enable Required PostgreSQL Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- 2. Create Custom Enum Types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'place_type') then
    create type public.place_type as enum ('attraction', 'stay', 'food');
  end if;

  if not exists (select 1 from pg_type where typname = 'feedback_type') then
    create type public.feedback_type as enum ('bug', 'idea', 'content_error', 'praise', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'feedback_status') then
    create type public.feedback_status as enum ('new', 'in_review', 'resolved', 'dismissed');
  end if;
end $$;

-- 3. Profiles Table (Linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  role public.user_role not null default 'user',
  language text default 'en',
  home_state text default 'Telangana',
  is_guest boolean not null default false,
  created_at timestamptz not null default now()
);

-- Helper function: is_admin() checks if current authenticated user has role = 'admin'
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Trigger to automatically populate public.profiles on new auth.users signup or guest creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    display_name,
    avatar_url,
    role,
    language,
    home_state,
    is_guest
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      case when new.email is not null then split_part(new.email, '@', 1) else null end,
      case when new.is_anonymous then 'Guest Explorer' else 'Traveler' end
    ),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', null),
    'user',
    coalesce(new.raw_user_meta_data->>'language', 'en'),
    'Telangana',
    coalesce(new.is_anonymous, false)
  )
  on conflict (id) do update set
    is_guest = coalesce(new.is_anonymous, false),
    display_name = case
      when profiles.is_guest and not coalesce(new.is_anonymous, false)
      then coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        case when new.email is not null then split_part(new.email, '@', 1) else null end,
        profiles.display_name
      )
      else profiles.display_name
    end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Places Table
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type public.place_type not null,
  category text,
  state text not null default 'Telangana',
  city text not null default 'Hyderabad',
  address text,
  lat double precision not null,
  lng double precision not null,
  description text,
  rules jsonb not null default '{}'::jsonb,
  price_amount numeric not null default 0,
  price_unit text default 'person',
  price_note text,
  opening_hours text,
  best_time text,
  tags text[] not null default '{}',
  wikidata_id text,
  osm_id text,
  rating_avg numeric(3,2) not null default 4.5,
  rating_count integer not null default 0,
  is_published boolean not null default true,
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists places_slug_idx on public.places (slug);
create index if not exists places_type_idx on public.places (type);
create index if not exists places_published_idx on public.places (is_published);

-- 5. Place Images Table (unique sha256 ensures an image cannot attach to multiple places)
create table if not exists public.place_images (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  url text not null,
  source text,
  license text,
  attribution text,
  width integer,
  height integer,
  sha256 text unique not null,
  is_primary boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists place_images_place_idx on public.place_images (place_id);

-- 6. Saved Places (Wishlist) Table
create table if not exists public.saved_places (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id uuid not null references public.places(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

create index if not exists saved_places_user_idx on public.saved_places (user_id);

-- 7. Trips Table (Custom itineraries & shared trip plans)
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  days jsonb not null default '[]'::jsonb,
  budget numeric not null default 0,
  travellers integer not null default 1,
  created_at timestamptz not null default now(),
  share_slug text unique
);

create index if not exists trips_user_idx on public.trips (user_id);
create index if not exists trips_share_slug_idx on public.trips (share_slug);

-- 8. AI Conversations Table
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New Conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_user_idx on public.conversations (user_id);

-- 9. AI Messages Table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  citations jsonb not null default '[]'::jsonb,
  model text,
  tokens integer,
  feedback smallint check (feedback in (-1, 0, 1)),
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_idx on public.messages (conversation_id);

-- 10. Feedback Table
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  type public.feedback_type not null default 'other',
  rating integer check (rating between 1 and 5),
  message text not null,
  page_url text,
  place_id uuid references public.places(id) on delete set null,
  screenshot_url text,
  status public.feedback_status not null default 'new',
  admin_note text,
  created_at timestamptz not null default now()
);

create index if not exists feedback_user_idx on public.feedback (user_id);
create index if not exists feedback_status_idx on public.feedback (status);

-- 11. Audit Logs Table (Admin actions & schema change track)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  diff jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_entity_idx on public.audit_logs (entity, entity_id);

-- 12. Place Embeddings Table (Vector store for semantic search & RAG)
create table if not exists public.place_embeddings (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists place_embeddings_hnsw_idx
  on public.place_embeddings
  using hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- A. Profiles RLS
alter table public.profiles enable row level security;

create policy "Users can read own profile or admin can read all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

-- B. Places RLS
alter table public.places enable row level security;

create policy "Published places are public-read; admin reads all"
  on public.places for select
  using (is_published = true or public.is_admin());

create policy "Only admin can insert places"
  on public.places for insert
  with check (public.is_admin());

create policy "Only admin can update places"
  on public.places for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Only admin can delete places"
  on public.places for delete
  using (public.is_admin());

-- C. Place Images RLS
alter table public.place_images enable row level security;

create policy "Place images are public-read when place is published"
  on public.place_images for select
  using (
    exists (
      select 1 from public.places p
      where p.id = place_images.place_id and (p.is_published = true or public.is_admin())
    )
  );

create policy "Only admin can insert place images"
  on public.place_images for insert
  with check (public.is_admin());

create policy "Only admin can update place images"
  on public.place_images for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Only admin can delete place images"
  on public.place_images for delete
  using (public.is_admin());

-- D. Saved Places RLS
alter table public.saved_places enable row level security;

create policy "Users can read only their own saved places"
  on public.saved_places for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert into own saved places"
  on public.saved_places for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from own saved places"
  on public.saved_places for delete
  using (auth.uid() = user_id or public.is_admin());

-- E. Trips RLS
alter table public.trips enable row level security;

create policy "Users read own trips or public shared trips"
  on public.trips for select
  using (auth.uid() = user_id or share_slug is not null or public.is_admin());

create policy "Users can insert own trips"
  on public.trips for insert
  with check (auth.uid() = user_id);

create policy "Users can update own trips"
  on public.trips for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "Users can delete own trips"
  on public.trips for delete
  using (auth.uid() = user_id or public.is_admin());

-- F. Conversations RLS
alter table public.conversations enable row level security;

create policy "Users can manage only their own conversations"
  on public.conversations for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

-- G. Messages RLS
alter table public.messages enable row level security;

create policy "Users can manage messages in their own conversations"
  on public.messages for all
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and (c.user_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and (c.user_id = auth.uid() or public.is_admin())
    )
  );

-- H. Feedback RLS
alter table public.feedback enable row level security;

create policy "Users can view own feedback or admin can view all"
  on public.feedback for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Only admin can update feedback status and notes"
  on public.feedback for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Only admin can delete feedback"
  on public.feedback for delete
  using (public.is_admin());

-- I. Audit Logs RLS
alter table public.audit_logs enable row level security;

create policy "Only admin can view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

create policy "Only admin can insert audit logs"
  on public.audit_logs for insert
  with check (public.is_admin());

-- J. Place Embeddings RLS
alter table public.place_embeddings enable row level security;

create policy "Public can read embeddings of published places"
  on public.place_embeddings for select
  using (
    public.is_admin() or exists (
      select 1 from public.places p
      where p.id = place_embeddings.place_id and p.is_published = true
    )
  );

create policy "Only admin can manage embeddings"
  on public.place_embeddings for all
  using (public.is_admin())
  with check (public.is_admin());
