-- Capture the two waitlist form fields that were previously dropped on the
-- floor (only surfaced in the admin email): the user's intent (buyer vs
-- closer) and the multi-select focus areas (residential / commercial /
-- offplan).

alter table public.leads
  add column if not exists intent text,
  add column if not exists focus text[];

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leads_intent_check'
  ) then
    alter table public.leads
      add constraint leads_intent_check
      check (intent is null or intent in ('buyer', 'closer'));
  end if;
end$$;

create index if not exists leads_intent_idx on public.leads (intent);
