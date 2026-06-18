-- Lets the lead row carry the partner code so we can query "who referred this
-- lead" without joining through referral_conversions. Indexed because we'll
-- aggregate per-partner conversions in the dashboard.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS partner_code text NULL;

CREATE INDEX IF NOT EXISTS leads_partner_code_idx
  ON public.leads (partner_code)
  WHERE partner_code IS NOT NULL;
