/* ===================================================================
   iClose referral attribution, unified across member + partner codes.

   One cookie (iclose_ref), one namespace, case-insensitive. Codes are
   uppercased on the way in and matched case-insensitively downstream.

   Capture order on the client:
     1. ?ref=CODE in the URL
     2. ?partner=CODE (alias kept for legacy partner links)
     3. existing iclose_ref cookie
   First-touch wins: an existing cookie is never overwritten during
   the attribution window.

   We also stamp an iclose_vid visitor-id cookie (UUID, 1 year) the
   first time we see a visitor — referral_clicks joins on it so the
   academy can attribute the eventual signup to the click that drove
   it.

   Cookie domain comes from NEXT_PUBLIC_COOKIE_DOMAIN (e.g. .iclose.ae)
   in production and is left unset in local dev so cookies still work
   on localhost.
   =================================================================== */

const COOKIE_NAME = 'iclose_ref';
const VISITOR_COOKIE = 'iclose_vid';
const STORAGE_KEY = 'iclose_ref';
const ATTRIBUTION_DAYS = 60;
const VISITOR_DAYS = 365;

const SAFE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I

/* Shared referral-code shape: uppercase letters, digits and dashes.
   3–40 chars, must not start with a dash. Matches both the 8-char
   member codes (generateReferralCode) and the human-readable partner
   codes (PSPL-HIQI). */
const REFERRAL_CODE_RE = /^[A-Z0-9][A-Z0-9-]{2,39}$/;

export function generateReferralCode(length = 8): string {
  const bytes =
    typeof crypto !== 'undefined' && 'getRandomValues' in crypto
      ? crypto.getRandomValues(new Uint8Array(length))
      : (() => {
          const a = new Uint8Array(length);
          for (let i = 0; i < length; i++) a[i] = Math.floor(Math.random() * 256);
          return a;
        })();
  let out = '';
  for (let i = 0; i < length; i++) {
    out += SAFE_ALPHABET[bytes[i] % SAFE_ALPHABET.length];
  }
  return out;
}

export function isValidReferralCode(code: unknown): code is string {
  if (typeof code !== 'string') return false;
  return REFERRAL_CODE_RE.test(code.toUpperCase());
}

export function normalizeReferralCode(code: string): string | null {
  const upper = code.trim().toUpperCase();
  return isValidReferralCode(upper) ? upper : null;
}

/* ----------- Client helpers (no-op when called server-side) ----------- */

function cookieDomain(): string | null {
  const d = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  return d && d.length > 0 ? d : null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const domain = cookieDomain();
  const domainPart = domain ? `; domain=${domain}` : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/${domainPart}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((r) => r.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // RFC4122-ish fallback for ancient browsers.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* Ensure the visitor has a stable iclose_vid cookie, set fresh once
   per visitor and re-used forever after. Returns the id. */
export function ensureVisitorId(): string | null {
  if (typeof document === 'undefined') return null;
  const existing = getCookie(VISITOR_COOKIE);
  if (existing) return existing;
  const id = generateUuid();
  setCookie(VISITOR_COOKIE, id, VISITOR_DAYS);
  return id;
}

/* Promote ?ref= (or ?partner=) from the current URL into localStorage
   + the iclose_ref cookie. Also stamps iclose_vid. First-touch wins:
   we never overwrite an existing referral cookie within the window. */
export function captureReferralFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  ensureVisitorId();

  const params = new URLSearchParams(window.location.search);
  const raw = params.get('ref') ?? params.get('partner');
  const fromUrl = raw ? normalizeReferralCode(raw) : null;

  const existing =
    getCookie(COOKIE_NAME) ||
    (typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY)
      : null);

  if (!existing && fromUrl) {
    setCookie(COOKIE_NAME, fromUrl, ATTRIBUTION_DAYS);
    try {
      localStorage.setItem(STORAGE_KEY, fromUrl);
    } catch {
      // Storage blocked — cookie still covers us.
    }
    return fromUrl;
  }
  return existing || fromUrl;
}

/* Read the strongest signal we have right now: URL > localStorage >
   cookie. URL wins so a fresh link supersedes a stale stored code if
   the visitor clicks two partner links in sequence. */
export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('ref') ?? params.get('partner');
  const fromUrl = raw ? normalizeReferralCode(raw) : null;
  if (fromUrl) return fromUrl;
  const fromStorage =
    typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY)
      : null;
  if (fromStorage && isValidReferralCode(fromStorage)) return fromStorage.toUpperCase();
  const fromCookie = getCookie(COOKIE_NAME);
  if (fromCookie && isValidReferralCode(fromCookie)) return fromCookie.toUpperCase();
  return null;
}

export function buildReferralLink(code: string, origin?: string): string {
  const base =
    origin ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://iclose.ae');
  return `${base}/?ref=${code}`;
}
