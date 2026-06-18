# iClose — setup notes

## 1. Google sign-in (Supabase OAuth)

The login/signup pages call `supabase.auth.signInWithOAuth({ provider: 'google' })`
and redirect back to the app origin (`/`). To make the **Continue with Google**
button actually work, enable the Google provider in Supabase and register the
redirect URIs.

Supabase project: `nnkicmfsdbfpucfcnutn` → callback URL is
`https://nnkicmfsdbfpucfcnutn.supabase.co/auth/v1/callback`

### A. Google Cloud Console
1. **APIs & Services → OAuth consent screen** → configure (External), add app
   name, support email, and your domain. Publish (or add test users while in
   Testing).
2. **APIs & Services → Credentials → Create credentials → OAuth client ID** →
   type **Web application**.
3. **Authorized JavaScript origins** — add each origin the app runs on:
   - `https://iclose.ae` (production, when live)
   - your Vercel preview origin, e.g. `https://closehq-git-claude-nice-gauss-914vbv-<team>.vercel.app`
   - `http://localhost:3000` (local dev)
4. **Authorized redirect URIs** — add the **Supabase callback** (this is the key one):
   - `https://nnkicmfsdbfpucfcnutn.supabase.co/auth/v1/callback`
5. Create → copy the **Client ID** and **Client secret**.

### B. Supabase dashboard
1. **Authentication → Providers → Google** → enable → paste the **Client ID**
   and **Client secret** → save.
2. **Authentication → URL Configuration**:
   - **Site URL**: your production URL (e.g. `https://iclose.ae`).
   - **Redirect URLs** (allow-list): add one entry per origin the app
     redirects back to, with a wildcard:
     - `https://iclose.ae/**`
     - `https://*.vercel.app/**` (covers preview deployments)
     - `http://localhost:3000/**`

### C. Email/password (already used)
- **Authentication → Providers → Email** — keep enabled. With "Confirm email"
  on, sign-up shows the "check your email" screen until the user confirms (the
  app already handles this).

That's it — no code change needed; the buttons are already wired.

---

## 2. Move the home-card images to owned storage

The three Dubai home-card images are generated and currently served from the
generation CDN. To serve them from our own domain instead:

1. Run locally (the cloud build env blocks that CDN host):
   ```bash
   bash scripts/fetch-home-images.sh
   ```
   This downloads `buy.png`, `sell.png`, `close.png` into `public/images/home/`.
2. Commit those PNGs.
3. In `app/(portal)/page.tsx`, set `LOCAL_IMAGES = true`.

(Or: add `d8j0ntlcm91z4.cloudfront.net` to this environment's network egress
allow-list and tell me — I'll download + commit + flip the flag.)
