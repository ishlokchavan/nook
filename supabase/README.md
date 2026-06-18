# Nook — Supabase (Milestone 2)

Project: `kuddszxqjdkoclbnanwv`

## Apply the schema

Open **Supabase → SQL Editor** and run these **in order** (paste each file's
contents, run, then the next):

1. `migrations/0001_schema.sql` — enums + tables
2. `migrations/0002_rls.sql` — Row-Level Security + the `contact_phone` column lock
3. `migrations/0003_functions.sql` — `wallet_balance`, `unlock_contact`, `refund_unlock`
4. `seed.sql` — demo suppliers, posts, and a `client_demo` wallet (run last)

## The security model (why it's safe)

- **`suppliers.contact_phone` is unreadable by clients.** RLS is row-level, so
  the column is hidden with **column privileges**: `SELECT` on `suppliers` is
  revoked and re-granted on every column *except* `contact_phone`. A client
  query touching that column is rejected by Postgres before RLS runs.
- **The only way to get a phone number is `unlock_contact(supplier_id)`** — a
  `SECURITY DEFINER` function that runs as the table owner. It atomically
  checks credits, debits the ledger, records the unlock, and returns the phone.
  Re-unlocking the same supplier returns the phone without charging again.
- Never call these with the service-role key on behalf of an untrusted client.

## Quick sanity checks (SQL editor)

```sql
-- public feed view (no phone column): should work
select profile_id, type, areas, rating_avg from public.suppliers limit 5;

-- this should ERROR with "permission denied for column contact_phone"
select contact_phone from public.suppliers limit 1;

-- demo client balance: 5
select public.wallet_balance('00000000-0000-0000-0000-0000000000c1');
```

> The `contact_phone` SELECT error only appears when querying as `anon` /
> `authenticated`. The SQL Editor runs as a privileged role, so test the column
> lock from the app (anon key) or with `set role authenticated;`.
