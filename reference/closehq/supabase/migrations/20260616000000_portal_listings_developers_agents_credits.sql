-- Portal data model: developers, listings, agents/agencies, credits.
--
-- Multilingual by design: human-readable, locale-varying text lives in
-- *_translations tables (one row per locale) so the entire platform — including
-- DB-stored content — localises. Arabic drives full RTL at the UI layer.
--
-- Locales: en, ru, ar, zh, hi (more later). 'en' is the fallback.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type developer_tier as enum ('private_top', 'private', 'government');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_purpose as enum ('sale', 'rent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type completion_status as enum ('ready', 'off_plan');
exception when duplicate_object then null; end $$;

do $$ begin
  create type property_category as enum ('residential', 'commercial');
exception when duplicate_object then null; end $$;

do $$ begin
  create type property_type as enum
    ('apartment', 'villa', 'townhouse', 'penthouse', 'plot', 'office', 'retail');
exception when duplicate_object then null; end $$;

-- Anti-misuse: who created the listing. Owner/POA self-listings vs RERA agent.
do $$ begin
  create type listing_source as enum ('owner', 'poa', 'agent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_status as enum ('draft', 'pending_review', 'active', 'sold', 'rented', 'archived');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Developers (+ translations for blurbs)
-- ---------------------------------------------------------------------------
create table if not exists public.developers (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  name         text not null,
  logo_url     text,
  discount_pct numeric(5,2),                 -- null = not disclosed / government
  tier         developer_tier not null default 'private',
  cta_target   text,
  sort_weight  int not null default 100,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.developer_translations (
  id           uuid primary key default gen_random_uuid(),
  developer_id uuid not null references public.developers(id) on delete cascade,
  locale       text not null,
  blurb        text,
  unique (developer_id, locale)
);

-- ---------------------------------------------------------------------------
-- Agencies + agents
-- ---------------------------------------------------------------------------
create table if not exists public.agencies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  logo_url    text,
  license_no  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.agents (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  photo_url   text,
  agency_id   uuid references public.agencies(id) on delete set null,
  rera_no     text,
  languages   text[] not null default '{}',
  nationality text,
  is_verified boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Listings (+ per-field translations)
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  reference     text unique not null,
  purpose       listing_purpose not null default 'sale',
  category      property_category not null default 'residential',
  property_type property_type not null default 'apartment',
  completion    completion_status not null default 'ready',
  status        listing_status not null default 'active',
  source        listing_source not null default 'agent',

  city          text not null default 'Dubai',
  community     text,
  building      text,
  latitude      numeric(9,6),
  longitude     numeric(9,6),

  bedrooms      int,
  bathrooms     int,
  area_sqft     numeric(10,2),
  price_aed     numeric(14,2) not null,

  developer_id  uuid references public.developers(id) on delete set null,
  agent_id      uuid references public.agents(id) on delete set null,

  is_verified   boolean not null default false,
  cover_image_url text,
  images        jsonb not null default '[]',
  amenities     text[] not null default '{}',

  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.listing_translations (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  locale      text not null,
  title       text not null,
  description text,
  unique (listing_id, locale)
);

create index if not exists listings_status_idx      on public.listings (status);
create index if not exists listings_purpose_idx     on public.listings (purpose, completion);
create index if not exists listings_community_idx   on public.listings (community);
create index if not exists listings_price_idx       on public.listings (price_aed);
create index if not exists listing_tr_locale_idx    on public.listing_translations (locale);

-- ---------------------------------------------------------------------------
-- Transactions: DLD-style sold/rented price records for the explorer.
-- ---------------------------------------------------------------------------
do $$ begin
  create type transaction_kind as enum ('sold', 'rented');
exception when duplicate_object then null; end $$;

create table if not exists public.transactions (
  id            uuid primary key default gen_random_uuid(),
  kind          transaction_kind not null default 'sold',
  occurred_on   date not null,
  city          text not null default 'Dubai',
  community     text,
  building      text,
  property_type property_type not null default 'apartment',
  bedrooms      int,
  area_sqft     numeric(10,2),
  price_aed     numeric(14,2) not null,
  created_at    timestamptz not null default now()
);

create index if not exists transactions_kind_idx      on public.transactions (kind);
create index if not exists transactions_community_idx on public.transactions (community);
create index if not exists transactions_date_idx      on public.transactions (occurred_on desc);

-- ---------------------------------------------------------------------------
-- Credits (1 credit = 0.5 AED). Ledger of credit movements per account.
-- ---------------------------------------------------------------------------
create table if not exists public.credit_transactions (
  id          uuid primary key default gen_random_uuid(),
  account_ref text not null,                  -- user id / email until auth wired
  delta       int not null,                   -- +earn / -redeem, in credits
  reason      text,
  listing_id  uuid references public.listings(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index if not exists credit_tx_account_idx on public.credit_transactions (account_ref);

-- ---------------------------------------------------------------------------
-- Row level security: public read of active/published content only.
-- Writes go through the service role / authenticated flows (added later).
-- ---------------------------------------------------------------------------
alter table public.developers            enable row level security;
alter table public.developer_translations enable row level security;
alter table public.agencies              enable row level security;
alter table public.agents                enable row level security;
alter table public.listings              enable row level security;
alter table public.listing_translations  enable row level security;
alter table public.transactions          enable row level security;
alter table public.credit_transactions   enable row level security;

do $$ begin
  create policy "public read active developers" on public.developers
    for select using (is_active);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read developer translations" on public.developer_translations
    for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read agencies" on public.agencies
    for select using (is_active);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read agents" on public.agents
    for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read active listings" on public.listings
    for select using (status = 'active');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read listing translations" on public.listing_translations
    for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read transactions" on public.transactions
    for select using (true);
exception when duplicate_object then null; end $$;
