-- ============================================================================
-- Explorex Migration: 20261024000005_ai_chatbot_rag.sql
-- Description: Production RAG AI chatbot tables, conversations pinning,
--              ai_logs telemetry, and full-text search indexes.
-- ============================================================================

-- 1. Add is_pinned to conversations if not exists
alter table public.conversations
  add column if not exists is_pinned boolean not null default false;

-- 2. Add parent_message_id to messages for conversation tree / regenerations
alter table public.messages
  add column if not exists parent_message_id uuid references public.messages(id) on delete set null;

-- 3. AI Logs Telemetry Table (Telemetry, Latency, Token Usage, Model Routing)
create table if not exists public.ai_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete cascade,
  query text not null,
  model text not null,
  prompt_tokens integer default 0,
  completion_tokens integer default 0,
  latency_ms integer default 0,
  status text not null default 'success', -- 'success' | 'fallback' | 'error'
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ai_logs_user_idx on public.ai_logs (user_id);
create index if not exists ai_logs_conversation_idx on public.ai_logs (conversation_id);
create index if not exists ai_logs_created_at_idx on public.ai_logs (created_at desc);

-- 4. Enable RLS on ai_logs
alter table public.ai_logs enable row level security;

create policy "Users can read own ai_logs or admin reads all"
  on public.ai_logs for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Authenticated users or server can insert ai_logs"
  on public.ai_logs for insert
  with check (auth.uid() = user_id or user_id is null or public.is_admin());

-- 5. Full-Text Search configuration on place_embeddings content
create index if not exists place_embeddings_content_fts_idx
  on public.place_embeddings
  using gin (to_tsvector('english', content));

-- 6. Full-Text Search configuration on places name, category, and description
create index if not exists places_fts_idx
  on public.places
  using gin (to_tsvector('english', name || ' ' || coalesce(category, '') || ' ' || coalesce(city, '') || ' ' || coalesce(state, '') || ' ' || coalesce(description, '')));
