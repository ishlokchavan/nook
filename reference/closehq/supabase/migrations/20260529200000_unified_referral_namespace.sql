-- Unifies partner + member referral attribution onto leads.referred_by_code
-- (uppercase across the namespace). The short-lived partner_code column added
-- earlier in this branch is dropped: that data — when present — already lives
-- in referred_by_code now.
ALTER TABLE public.leads DROP COLUMN IF EXISTS partner_code;
DROP INDEX IF EXISTS leads_partner_code_idx;

-- Existing partners.code was lowercase. New code generation uppercases, and
-- lookups are case-insensitive; uppercase what's already there so the column
-- matches what's written by /ref/<CODE> and the lead form going forward.
UPDATE public.partners SET code = upper(code) WHERE code <> upper(code);

-- Replace the plain unique on code with a case-insensitive one so PSPL-HIQI
-- and pspl-hiqi can never co-exist.
ALTER TABLE public.partners DROP CONSTRAINT IF EXISTS partners_code_key;
DROP INDEX IF EXISTS partners_code_ci_key;
CREATE UNIQUE INDEX partners_code_ci_key ON public.partners (upper(code));
