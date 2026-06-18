-- iClose internal referral tracking.
--
-- Each lead gets a unique short code they can share. When a new lead
-- arrives carrying a code in `referred_by_code`, we resolve it to the
-- referrer's lead id and increment their `referral_count`.

alter table public.leads
  add column if not exists referral_code text,
  add column if not exists referred_by_code text,
  add column if not exists referred_by_lead_id uuid references public.leads(id),
  add column if not exists referral_count integer not null default 0;

create unique index if not exists leads_referral_code_unique
  on public.leads (referral_code)
  where referral_code is not null;

create index if not exists leads_referred_by_lead_id_idx
  on public.leads (referred_by_lead_id);

create index if not exists leads_referred_by_code_idx
  on public.leads (referred_by_code);

create or replace function public.bump_referral_count(p_lead_id uuid)
returns void
language sql
as $$
  update public.leads
     set referral_count = coalesce(referral_count, 0) + 1
   where id = p_lead_id;
$$;
