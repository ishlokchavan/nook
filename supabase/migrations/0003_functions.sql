-- ============================================================================
-- Nook — Milestone 2: functions (the unlock flow)
-- Run after 0002_rls.sql.
-- ============================================================================

-- Wallet balance = SUM(delta) of a profile's ledger. -----------------------
create or replace function public.wallet_balance(p_profile uuid)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(delta), 0)::int
  from public.credits_ledger
  where profile_id = p_profile;
$$;

-- Convenience: the caller's own balance (for the wallet UI). ----------------
create or replace function public.my_wallet_balance()
returns int
language sql
stable
security definer
set search_path = public
as $$
  select public.wallet_balance(auth.uid());
$$;

-- unlock_contact(p_supplier_id) --------------------------------------------
-- The core monetisation + privacy primitive. Atomically:
--   1. If the caller already has an active (non-refunded) unlock for this
--      supplier, return the phone WITHOUT charging again.
--   2. Otherwise verify the wallet has enough credits, debit the ledger,
--      insert an unlock row, and return the phone.
-- SECURITY DEFINER so it can read suppliers.contact_phone (which clients are
-- denied at the column level). Runs in a single transaction, so a failure
-- anywhere rolls back the debit.
create or replace function public.unlock_contact(p_supplier_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  c_unlock_cost constant int := 1;   -- credits per unlock (pricing maps to AED off-DB)
  v_client      uuid := auth.uid();
  v_phone       text;
  v_balance     int;
  v_unlock_id   uuid;
begin
  if v_client is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select contact_phone into v_phone
  from public.suppliers
  where profile_id = p_supplier_id;

  if v_phone is null then
    raise exception 'supplier_not_found_or_no_contact' using errcode = 'P0002';
  end if;

  -- Already unlocked? Return the phone, no charge.
  if exists (
    select 1 from public.unlocks
    where client_id = v_client and supplier_id = p_supplier_id and refunded = false
  ) then
    return v_phone;
  end if;

  -- Enough credits?
  v_balance := public.wallet_balance(v_client);
  if v_balance < c_unlock_cost then
    raise exception 'insufficient_credits' using errcode = 'P0001';
  end if;

  insert into public.unlocks (client_id, supplier_id, cost_credits)
  values (v_client, p_supplier_id, c_unlock_cost)
  returning id into v_unlock_id;

  insert into public.credits_ledger (profile_id, delta, reason, ref_id)
  values (v_client, -c_unlock_cost, 'unlock', v_unlock_id);

  return v_phone;
end;
$$;

-- Only signed-in users may call it; anon cannot.
revoke execute on function public.unlock_contact(uuid) from anon;
grant execute on function public.unlock_contact(uuid) to authenticated;
grant execute on function public.my_wallet_balance() to authenticated;

-- refund_unlock(p_unlock_id) -----------------------------------------------
-- Admin-only: marks an unlock refunded (e.g. validated dead number) and
-- credits the client back. Used by the report-review queue (Milestone 7/8).
create or replace function public.refund_unlock(p_unlock_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_unlock public.unlocks;
begin
  if not public.is_admin() then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  select * into v_unlock from public.unlocks where id = p_unlock_id;
  if not found or v_unlock.refunded then
    raise exception 'unlock_not_found_or_already_refunded' using errcode = 'P0002';
  end if;

  update public.unlocks set refunded = true where id = p_unlock_id;

  insert into public.credits_ledger (profile_id, delta, reason, ref_id)
  values (v_unlock.client_id, v_unlock.cost_credits, 'refund', p_unlock_id);
end;
$$;

revoke execute on function public.refund_unlock(uuid) from anon, authenticated;
