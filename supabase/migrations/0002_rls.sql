-- ============================================================================
-- Nook — Milestone 2: Row-Level Security + column privileges
-- The most important file. Enforces "contact hidden until paid" at the DB,
-- not just the UI. Run after 0001_schema.sql.
-- ============================================================================

alter table public.profiles       enable row level security;
alter table public.suppliers       enable row level security;
alter table public.posts            enable row level security;
alter table public.requests         enable row level security;
alter table public.quotes           enable row level security;
alter table public.credits_ledger   enable row level security;
alter table public.unlocks          enable row level security;
alter table public.ratings          enable row level security;
alter table public.reports          enable row level security;

-- Admin helper: true when the caller's profile role is 'admin'. ------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- profiles -----------------------------------------------------------------
-- Public identity (handle/role) is readable by everyone; users write own row.
create policy "profiles are public read"
  on public.profiles for select using (true);
create policy "users insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "users update own profile"
  on public.profiles for update using (auth.uid() = id);

-- suppliers ----------------------------------------------------------------
-- Rows are publicly visible, BUT contact_phone is locked at the column level
-- below (RLS is row-level only, so column privileges do the column hiding).
create policy "suppliers are public read"
  on public.suppliers for select using (true);
create policy "supplier manages own row"
  on public.suppliers for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

-- Column lock: drop the blanket SELECT, then re-grant every column EXCEPT
-- contact_phone. A client SELECT that touches contact_phone is now rejected
-- by Postgres before RLS even runs. unlock_contact() is SECURITY DEFINER and
-- runs as the table owner, so it can still read the phone.
revoke select on public.suppliers from anon, authenticated;
grant select (
  profile_id, type, areas, bio, verified, verification_score,
  rating_avg, rating_count, created_at
) on public.suppliers to anon, authenticated;

-- posts --------------------------------------------------------------------
create policy "approved posts are public read"
  on public.posts for select
  using (moderation_status = 'approved' or auth.uid() = supplier_id or public.is_admin());
create policy "supplier manages own posts"
  on public.posts for all
  using (auth.uid() = supplier_id)
  with check (auth.uid() = supplier_id);

-- requests -----------------------------------------------------------------
-- Client owns their requests; suppliers may read open requests to quote them.
create policy "client manages own requests"
  on public.requests for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);
create policy "suppliers read open requests"
  on public.requests for select
  using (
    status = 'open'
    and exists (select 1 from public.suppliers s where s.profile_id = auth.uid())
  );
create policy "admin reads requests"
  on public.requests for select using (public.is_admin());

-- quotes -------------------------------------------------------------------
create policy "supplier writes own quotes"
  on public.quotes for all
  using (auth.uid() = supplier_id)
  with check (auth.uid() = supplier_id);
create policy "client reads quotes on own requests"
  on public.quotes for select
  using (exists (
    select 1 from public.requests r
    where r.id = quotes.request_id and r.client_id = auth.uid()
  ));

-- credits_ledger -----------------------------------------------------------
-- Read your own wallet entries. Writes happen only through SECURITY DEFINER
-- functions (unlock_contact / refunds) or the service role — never directly.
create policy "users read own ledger"
  on public.credits_ledger for select using (auth.uid() = profile_id);

-- unlocks ------------------------------------------------------------------
-- Clients see their own unlocks. Inserts go through unlock_contact() only.
create policy "client reads own unlocks"
  on public.unlocks for select using (auth.uid() = client_id);
create policy "admin reads unlocks"
  on public.unlocks for select using (public.is_admin());

-- ratings ------------------------------------------------------------------
create policy "ratings are public read"
  on public.ratings for select using (true);
create policy "client writes own ratings"
  on public.ratings for all
  using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

-- reports ------------------------------------------------------------------
create policy "reporter creates reports"
  on public.reports for insert with check (auth.uid() = reporter_id);
create policy "reporter reads own reports"
  on public.reports for select using (auth.uid() = reporter_id);
create policy "admin reads reports"
  on public.reports for select using (public.is_admin());
