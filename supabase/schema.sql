-- À exécuter dans Supabase : Project > SQL Editor > New query
-- Active l'auth anonyme d'abord : Authentication > Providers > Anonymous Sign-Ins > Enable

create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  answers jsonb not null,
  plan_summary jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.quiz_responses enable row level security;

create policy "users can insert their own responses"
  on public.quiz_responses for insert
  with check (auth.uid() = user_id);

create policy "users can read their own responses"
  on public.quiz_responses for select
  using (auth.uid() = user_id);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  behavior_id text not null,
  trigger_context text,
  emotion text,
  duration text,
  created_at timestamptz not null default now()
);

alter table public.episodes enable row level security;

create policy "users can insert their own episodes"
  on public.episodes for insert
  with check (auth.uid() = user_id);

create policy "users can read their own episodes"
  on public.episodes for select
  using (auth.uid() = user_id);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mood text not null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "users can insert their own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "users can read their own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

-- Profil interne (personnalisation, jamais visible par les autres utilisateurs) +
-- identité communauté (pseudo/anonymat, réglage séparé) — brief v2 section 4.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  display_name_hidden boolean not null default false,
  age int,
  age_hidden boolean not null default false,
  gender text,
  gender_hidden boolean not null default false,
  anonymous_mode boolean not null default false,
  community_public boolean not null default false,
  community_pseudo text,
  avatar_emoji text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
