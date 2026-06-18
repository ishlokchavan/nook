-- Brings partners onto the same email-verification pattern as leads/educators:
-- verification_token gates /api/verify?type=partner, is_verified flips on
-- click, consent + UA captured for audit. Email is uniqued case-insensitively
-- so the API can give a clean duplicate response.

ALTER TABLE public.partners
  ADD COLUMN IF NOT EXISTS verification_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS consent_marketing boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consented_at timestamptz NULL,
  ADD COLUMN IF NOT EXISTS user_agent text NULL,
  ADD COLUMN IF NOT EXISTS referer text NULL;

CREATE UNIQUE INDEX IF NOT EXISTS partners_verification_token_key
  ON public.partners (verification_token);

CREATE UNIQUE INDEX IF NOT EXISTS partners_email_key
  ON public.partners (lower(email));
