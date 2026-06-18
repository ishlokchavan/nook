# iClose — Dubai Real Estate Agent Platform

A high-conversion, SEO-optimized landing page for a Dubai-based real estate agent platform. Built as a performance-first, investor-grade foundation that scales into a full platform (dashboard, listings, login).

**Pitch:** _Close Dubai deals on your terms — up to 90% commission, advance on SPA, zero monthly fees._

---

## ✦ What's inside

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** with a custom luxury design system (ink/bone/gold palette)
- **Framer Motion** for staged reveals and micro-interactions
- **React Hook Form + Zod** for the lead capture form, with a honeypot & API forwarding
- **Lucide** icons
- **next/image** with AVIF/WebP, responsive sizes, and lazy loading
- **GA4** + **Meta Pixel** integration via `next/script` (afterInteractive)
- **JSON-LD** Organization & WebSite structured data
- **Sitemap + robots** generated at build time
- **Edge runtime** API route for low-latency lead handling
- **Sticky header**, **floating WhatsApp** with pulse, **mobile menu**
- All sections: Hero · Trust · Value · How · Perks · Referral · Comparison · Final CTA · Footer

---

## ✦ Quick start

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env.local
# then edit .env.local with your real values

# 3. Dev
npm run dev
# → http://localhost:3000

# 4. Production
npm run build
npm run start
```

> Requires Node 18.18+ (Node 20 LTS recommended).

---

## ✦ Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Required | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical site URL — used for OG tags, sitemap, structured data |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | yes | International format, no `+` (e.g. `971501234567`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | yes | Public contact email shown in footer |
| `NEXT_PUBLIC_GA_ID` | optional | GA4 Measurement ID (e.g. `G-XXXXXXXXXX`) — analytics auto-disabled if blank |
| `NEXT_PUBLIC_META_PIXEL_ID` | optional | Meta Pixel ID — auto-disabled if blank |
| `LEAD_WEBHOOK_URL` | optional | Server-only. POSTs each new lead as JSON. Plug in Make.com, Zapier, n8n, your CRM, etc. If blank, leads are logged to the server console. |

---

## ✦ Deployment (Vercel)

Recommended path:

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project** and import the repo.
3. Framework will auto-detect as **Next.js**. Leave defaults.
4. Under **Environment Variables**, add the keys from `.env.example`. Mark `LEAD_WEBHOOK_URL` as a **Server** variable (not exposed to the browser).
5. Click **Deploy**.
6. Add your custom domain (e.g. `iclose.ae`) in **Settings → Domains** and update `NEXT_PUBLIC_SITE_URL` accordingly. Redeploy.

CLI alternative:

```bash
npm i -g vercel
vercel        # first deploy / preview
vercel --prod # promote to production
```

---

## ✦ Architecture

```
iclose/
├── app/
│   ├── api/lead/route.ts      # Edge API: validates + forwards leads
│   ├── globals.css            # Tailwind + design tokens
│   ├── icon.svg               # Favicon
│   ├── layout.tsx             # Fonts, metadata, schema, GA4, Pixel
│   ├── not-found.tsx          # On-brand 404
│   ├── page.tsx               # Landing composition
│   ├── robots.ts              # robots.txt generator
│   └── sitemap.ts             # sitemap.xml generator
├── components/
│   ├── header.tsx             # Sticky nav with mobile menu
│   ├── lead-form.tsx          # RHF + Zod form
│   ├── sections/              # All page sections
│   │   ├── hero.tsx
│   │   ├── trust.tsx
│   │   ├── value.tsx
│   │   ├── how.tsx
│   │   ├── perks.tsx
│   │   ├── referral.tsx
│   │   ├── comparison.tsx
│   │   ├── final-cta.tsx
│   │   └── footer.tsx
│   └── ui/                    # Reusable primitives
│       ├── button.tsx
│       ├── logo.tsx
│       ├── reveal.tsx
│       ├── section-label.tsx
│       └── whatsapp-float.tsx
├── hooks/
│   └── use-scrolled.ts
├── lib/
│   ├── analytics.ts           # GA4 + Pixel event helper
│   ├── site-config.ts         # Single source of truth
│   ├── utils.ts               # cn() helper
│   └── validations.ts         # Zod schemas
├── public/
│   └── logo.svg
├── next.config.js             # Image opt, headers, package opts
├── tailwind.config.ts         # Design tokens
└── tsconfig.json
```

---

## ✦ Design system

Color tokens (Tailwind):

- `ink` — `#0A0A0B` and shades — primary dark surface
- `bone` — `#F4F1EA` and shades — primary light surface
- `gold` — `#C8A862` (`light` `#D9BD7E`, `dark` `#9C8245`) — accent

Type:

- **Display:** Fraunces (serif, optical-sized) — for headlines, italic accents
- **Sans:** Inter — for body & UI
- **Mono:** JetBrains Mono — for eyebrows, KPIs, labels

Motion: `cubic-bezier(0.22, 1, 0.36, 1)` (a refined ease-out) used universally for that "luxury hardware" feel.

---

## ✦ CRO decisions made

A few things that aren't obvious from looking at the code:

1. **Hero KPI rail.** Three numbers (`90%`, `24h`, `0`) sit beside the headline. People scan numbers before they read prose; this delivers the value prop pre-attentively.
2. **Dual primary CTA.** "Start closing deals" (form) **+** "Speak on WhatsApp" (chat). In the GCC, WhatsApp converts higher than form-fill for many buyers — we offer both, and track each separately.
3. **Form is short by design.** 5 fields, with phone (not email) required. Email is optional — Dubai agents respond on WhatsApp, not email. Lower friction = higher submit rate.
4. **Honeypot field.** A hidden `website` input that bots fill but humans never see. Pretends to succeed for bots, never reaches the webhook.
5. **Comparison table is simple.** Seven rows, all green vs. red. We're not pretending the alternative is nuanced — closers want a clear case to take to a colleague.
6. **Floating WhatsApp with `Talk to us` reveal.** Pulse ring catches the eye; the side label appears on hover. Visible on every section, every scroll position.
7. **All animations are `whileInView`-triggered.** No animation runs on offscreen content — keeps Lighthouse happy and the experience snappy.

---

## ✦ Performance notes

Targets (Lighthouse mobile, throttled):

- Performance: 90+
- Accessibility: 95+
- Best Practices: 100
- SEO: 100

How we get there:

- `next/image` with `priority` only on the hero, `loading="lazy"` everywhere else
- AVIF/WebP via Next image config
- Fonts via `next/font/google` with `display: swap` and CSS variables (no FOUT layout shift)
- `optimizePackageImports` for `lucide-react` and `framer-motion`
- Edge runtime for the lead API
- Inline JSON-LD via `next/script` strategy `afterInteractive` (does not block render)
- No client-side fetch waterfalls on the landing page

---

## ✦ Scaling this into a full platform

The repo is structured so that adding routes is a one-folder operation:

- `app/dashboard/page.tsx` — agent dashboard (server component, can read session)
- `app/listings/[slug]/page.tsx` — individual property pages with full schema
- `app/(auth)/login/page.tsx` — auth flow group route
- `app/api/...` — extend the existing API surface (already at the edge)

Components in `components/ui/` are framework-agnostic and ready to be promoted to a shared package if you grow into a monorepo.

---

## ✦ Replacing the stock photos

The hero, perks, and final CTA use Unsplash images. Once you have brand-shot photography (Dubai Marina / Palm Jumeirah / yacht decks / interior staging), drop them into `/public/images/` and update the URLs in:

- `components/sections/hero.tsx` (`HERO_IMAGE`)
- `components/sections/perks.tsx` (`PERKS` array)
- `components/sections/final-cta.tsx` (`CTA_IMAGE`)

`next/image` will handle the rest.

---

## ✦ License

Proprietary. © iClose.
