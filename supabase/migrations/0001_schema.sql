-- ============================================================================
-- Nook — Milestone 2: schema
-- Run order: 0001_schema.sql → 0002_rls.sql → 0003_functions.sql → seed.sql
-- Paste into Supabase → SQL Editor (project kuddszxqjdkoclbnanwv) and run.
-- ============================================================================

-- Enums --------------------------------------------------------------------
create type user_role as enum ('client', 'supplier', 'admin');
create type supplier_type as enum ('carpenter', 'contractor', 'designer');
create type moderation_status as enum ('pending', 'approved', 'rejected');
create type request_status as enum ('open', 'closed', 'fulfilled');
create type report_target as enum ('supplier', 'post', 'unlock');

-- profiles -----------------------------------------------------------------
-- One row per auth user. display_handle is the ONLY public identity.
create table public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  role           user_role not null default 'client',
  display_handle text unique not null,
  created_at     timestamptz not null default now()
);

-- suppliers ----------------------------------------------------------------
-- contact_phone is PRIVATE: never selectable by clients (enforced with
-- column-level grants in 0002_rls.sql); revealed only via unlock_contact().
create table public.suppliers (
  profile_id         uuid primary key references public.profiles (id) on delete cascade,
  type               supplier_type not null,
  areas              text[] not null default '{}',
  bio                text,
  verified           boolean not null default false,
  verification_score int not null default 0,
  rating_avg         numeric(3, 2) not null default 0,
  rating_count       int not null default 0,
  contact_phone      text,                         -- PRIVATE
  created_at         timestamptz not null default now()
);

-- posts --------------------------------------------------------------------
create table public.posts (
  id                uuid primary key default gen_random_uuid(),
  supplier_id       uuid not null references public.suppliers (profile_id) on delete cascade,
  image_path        text not null,
  room_type         text,
  finish            text,
  tags              text[] not null default '{}',
  area              text,
  sqft              int,
  moderation_status moderation_status not null default 'pending',
  created_at        timestamptz not null default now()
);
create index posts_supplier_idx on public.posts (supplier_id);
create index posts_moderation_idx on public.posts (moderation_status);

-- requests -----------------------------------------------------------------
create table public.requests (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.profiles (id) on delete cascade,
  room_type    text,
  finish       text,
  sqft         int,
  area         text,
  budget_range text,
  status       request_status not null default 'open',
  created_at   timestamptz not null default now()
);
create index requests_client_idx on public.requests (client_id);

-- quotes -------------------------------------------------------------------
create table public.quotes (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid not null references public.requests (id) on delete cascade,
  supplier_id uuid not null references public.suppliers (profile_id) on delete cascade,
  price_range text,
  note        text,
  created_at  timestamptz not null default now(),
  unique (request_id, supplier_id)              -- one quote per supplier per request
);
create index quotes_request_idx on public.quotes (request_id);
create index quotes_supplier_idx on public.quotes (supplier_id);

-- credits_ledger -----------------------------------------------------------
-- Generic wallet: balance = SUM(delta) per profile. Either side can hold a
-- balance (supports Phase-2 supplier wallets). Append-only; never updated.
create table public.credits_ledger (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  delta      int not null,                       -- +credit / -debit
  reason     text not null,                      -- 'topup' | 'unlock' | 'refund' | ...
  ref_id     uuid,                               -- e.g. the unlock row
  created_at timestamptz not null default now()
);
create index credits_ledger_profile_idx on public.credits_ledger (profile_id);

-- unlocks ------------------------------------------------------------------
-- Records a paid contact reveal; gates the phone number. One active unlock
-- per (client, supplier) — re-unlocking returns the phone without charging.
create table public.unlocks (
  id           uuid primary key default gen_random_uuid(),
  client_id    uuid not null references public.profiles (id) on delete cascade,
  supplier_id  uuid not null references public.suppliers (profile_id) on delete cascade,
  cost_credits int not null,
  refunded     boolean not null default false,
  created_at   timestamptz not null default now()
);
create unique index unlocks_active_uniq
  on public.unlocks (client_id, supplier_id)
  where refunded = false;

-- ratings ------------------------------------------------------------------
create table public.ratings (
  id          uuid primary key default gen_random_uuid(),
  client_id   uuid not null references public.profiles (id) on delete cascade,
  supplier_id uuid not null references public.suppliers (profile_id) on delete cascade,
  score       int not null check (score between 1 and 5),
  created_at  timestamptz not null default now(),
  unique (client_id, supplier_id)
);

-- reports ------------------------------------------------------------------
-- Dead-number / complaint queue. A valid dead-number report refunds credits.
create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles (id) on delete cascade,
  target_type report_target not null,
  target_id   uuid not null,
  reason      text,
  created_at  timestamptz not null default now()
);
