# NOOK — Build Brief & Master Prompts

A Dubai-first marketplace connecting homeowners with **carpenters, contractors and interior designers**. Instagram-style portfolio feed, anonymous supplier handles, contact hidden until the client pays credits to **unlock**. This file is the source of truth for the build. Keep it in the repo root.

---

## 0. Before you paste anything (5 min setup)

1. **GitHub:** create an empty repo (e.g. `nook-app`) and open it in the Claude Code desktop app.
2. **Supabase:** create a new project at supabase.com. From Project Settings → API copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (server-only, never ship to client)
3. Add the **Supabase** and **Vercel** MCP connectors in Claude Code (or just have the Supabase CLI + `vercel` CLI available). Put this file in the repo root.
4. Paste **Master Prompt 1** below. Work through milestones one at a time, committing per milestone.

---

## 1. Product spec

**Users:** `client` (homeowner), `supplier` (carpenter | contractor | designer), `admin`.

**Core loop:**
1. Client browses a visual feed of real projects (no company names — anonymous handles like `carpenter_568`).
2. Client posts a structured request (room, finish, sqft, area, budget). Suppliers send quotes.
3. Client likes someone → spends **credits to unlock** their contact → reaches out directly off-platform.
4. Both sides rate. Dead/invalid number → credit refunded.

**Hard rules (these define the product):**
- **No free-text chat.** Structured forms only. Prevents contact leakage and keeps it simple.
- **Contact is hidden until unlocked.** Phone numbers must NEVER reach the client until a paid `unlock` exists. Enforce server-side (RLS + a secure RPC), not just in the UI.
- **Image moderation:** reject uploaded images that contain text/numbers (people sneak phone numbers into photos). MVP = flag for manual review; stretch = automated OCR check in an edge function.
- **Anonymous identity:** display handle only; real identity/contact gated.
- **Free-to-browse for clients;** clients pay only to unlock. Suppliers free at launch.

**Monetisation (build the schema for both from day one):**
- **Phase 1 — client unlock credits:** pay-per-unlock (e.g. 100 AED/unlock, or bundles like 500 AED = 4 unlocks).
- **Phase 2 — supplier revenue (the scalable layer):** supplier lead-subscription and/or verified-badge tier and/or take-rate. This fixes the low repeat-purchase problem of one-off unlocks. Model credits/wallet generically so either side can hold a balance.

---

## 2. Tech stack

- **Next.js (App Router, TypeScript, Server Components)** + **Tailwind CSS**. Optionally shadcn/ui.
- **Supabase**: Postgres, Auth (email OTP/magic link), Storage (project images), Row-Level Security, Edge Functions (moderation, unlock).
- **Vercel** hosting. Mobile-first, accessible, fast.
- Reuse the existing **Nook design language**: bg `#FAFAF8`, ink `#1C1B19`, honey accent `#BE7F33`, font **Plus Jakarta Sans**, rounded cards, soft shadows, Instagram-clean. (Port tokens from the existing landing page.)

---

## 3. Data model (refine as needed)

- **profiles** `(id → auth.users.id, role, display_handle unique, created_at)`
- **suppliers** `(profile_id → profiles.id, type, areas text[], bio, verified bool, verification_score int, rating_avg numeric, rating_count int, contact_phone text /* PRIVATE */)`
- **posts** `(id, supplier_id, image_path, room_type, finish, tags text[], area, sqft int, moderation_status, created_at)`
- **requests** `(id, client_id, room_type, finish, sqft int, area, budget_range, status, created_at)`
- **quotes** `(id, request_id, supplier_id, price_range, note, created_at)`
- **credits_ledger** `(id, profile_id, delta int, reason, ref_id, created_at)` — wallet = SUM(delta)
- **unlocks** `(id, client_id, supplier_id, cost_credits int, refunded bool, created_at)` — gates contact reveal
- **ratings** `(id, client_id, supplier_id, score int, created_at)`
- **reports** `(id, reporter_id, target_type, target_id, reason, created_at)` — dead number / complaint

**Security model (the most important part):**
- `suppliers.contact_phone` protected by RLS so a client can never `select` it directly.
- Reveal only through a `SECURITY DEFINER` RPC: `unlock_contact(p_supplier_id)` that, atomically: verifies the client has enough credits → inserts a `credits_ledger` debit → inserts an `unlocks` row → returns the phone. If an `unlocks` row already exists, return the phone without charging again.
- RLS everywhere: clients read their own data; suppliers read/write their own posts/quotes; everyone reads the public feed (minus private fields); admins read moderation/report queues.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Server components / route handlers / edge functions only.

---

## 4. Milestones (build in order, commit each)

1. **Scaffold** — Next.js + TS + Tailwind, Supabase client (server + browser), env wiring, Nook design tokens, base layout, email-OTP auth, protected routes.
2. **Schema + RLS** — SQL migrations for all tables, RLS policies, the `unlock_contact` RPC, seed script (fake suppliers/posts).
3. **Feed** — browse posts, filter by type/area/room; post detail with **locked contact** component.
4. **Supplier side** — onboarding, create post, image upload to Storage, moderation hook (flag images with detected text).
5. **Requests + quotes** — structured client request form; supplier quote submission; client sees quotes.
6. **Credits + unlock** — wallet UI, bundle purchase stub (Stripe later), `unlock_contact` flow, contact reveal.
7. **Trust** — ratings, reports, simple verification_score; refund-credit on valid dead-number report.
8. **Admin** — moderation queue + report review.
9. **Ship** — SEO, analytics, error states, then deploy to Vercel (Master Prompt 2).

**Engineering rules:** TypeScript strict; data access server-side; RLS-first; mobile-first; accessible; small commits per milestone; migrations as committed SQL files; `.env.local` for dev, Vercel env for prod.

---

## 5. MASTER PROMPT 1 — paste into Claude Code (build + Supabase)

> You are my senior full-stack engineer building **Nook**, a Dubai interior-services marketplace. Read `NOOK_BUILD_BRIEF.md` in the repo root and treat it as the source of truth for product, data model, security model, and milestones.
>
> Stack: Next.js (App Router, TypeScript, Server Components), Tailwind CSS, and Supabase (Postgres, Auth, Storage, RLS, Edge Functions). Reuse the Nook design tokens from the brief (light theme, honey `#BE7F33` accent, Plus Jakarta Sans, Instagram-clean).
>
> Work milestone by milestone in the order listed in the brief. After each milestone: summarise what you built, run/typecheck it, and make a single clean commit. Do not skip ahead.
>
> Start with **Milestone 1 (Scaffold)** now:
> - Initialise the Next.js + TypeScript + Tailwind project in this repo.
> - Add `@supabase/supabase-js` and `@supabase/ssr`; create separate server and browser Supabase clients reading from env.
> - Wire env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only). Create `.env.local.example`.
> - Implement email-OTP/magic-link auth, a session helper, and protected routes for `/app/*`.
> - Build the base layout and a small UI kit (button, input, card, pill) using the Nook tokens.
>
> Then **stop and show me** the file tree, the env I need to set, and how to run it locally, before moving to Milestone 2.
>
> Critical constraints, never violate: contact phone numbers must never be readable by clients except through the `unlock_contact` RPC after a paid unlock; enforce with RLS, not just UI. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. TypeScript strict. Mobile-first and accessible.
>
> Connect to my Supabase project using the keys I provide (via the Supabase MCP or the Supabase CLI). When you reach Milestone 2, generate SQL migration files for every table, the RLS policies, and the `unlock_contact` SECURITY DEFINER function exactly as described in the brief, apply them to my Supabase project, and add a seed script with realistic fake suppliers and posts.

---

## 6. MASTER PROMPT 2 — paste into Claude Code (deploy to Vercel)

> Deploy this Next.js app to Vercel and wire it to Supabase for production. Steps:
>
> 1. Ensure the app builds locally with no type errors (`npm run build`). Fix anything that breaks.
> 2. Push the latest commit to the `main` branch on GitHub.
> 3. Create/link a Vercel project for this repo (via the Vercel MCP or `vercel` CLI). Framework preset: Next.js.
> 4. Set Vercel **Environment Variables** for Production and Preview: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (mark the service-role key as sensitive; it must only be used server-side).
> 5. Trigger a production deployment and return the live URL.
> 6. In Supabase → Authentication → URL Configuration, add the Vercel production and preview domains to the allowed Redirect URLs and Site URL so email-OTP auth works in prod. Tell me exactly what to paste if you can't do it for me.
> 7. Verify: load the deployed site, confirm auth works end-to-end, confirm the feed reads from Supabase, and confirm a client CANNOT read any supplier phone number from the network tab without unlocking. Report back with the URL and the results of these checks.
>
> If the build fails on Vercel, pull the build logs, diagnose, fix, and redeploy until it's green.

---

## 7. Notes

- Payments: stub the credit purchase first (manual top-up / fake balance), add **Stripe** once the unlock flow works end-to-end.
- Licensing/trade-licence checks for suppliers and Stripe go-live can come after the core loop is proven.
- Validate demand in parallel: a small manual pilot (10–20 suppliers, a handful of clients) tells you if clients will actually pay to unlock before you scale spend.
