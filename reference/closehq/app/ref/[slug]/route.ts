import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { normalizeReferralCode } from '@/lib/referral';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'iclose_ref';
const VISITOR_COOKIE = 'iclose_vid';
const ATTRIBUTION_DAYS = 60;
const VISITOR_DAYS = 365;

const readCookie = (header: string | null, name: string) => {
  if (!header) return null;
  const match = header
    .split('; ')
    .find((c) => c.startsWith(name + '='));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const url = new URL(request.url);
  const code = normalizeReferralCode(slug);

  // Invalid code: still bounce to home so a stray bot can't dead-end the user,
  // but skip the cookie + click write.
  if (!code) {
    return NextResponse.redirect(new URL('/', url.origin));
  }

  const redirectUrl = new URL(`/?ref=${code}`, url.origin);
  const res = NextResponse.redirect(redirectUrl);

  const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;
  const cookieOpts = {
    path: '/' as const,
    sameSite: 'lax' as const,
    domain: cookieDomain,
  };

  res.cookies.set(COOKIE_NAME, code, {
    ...cookieOpts,
    maxAge: 60 * 60 * 24 * ATTRIBUTION_DAYS,
  });

  // Establish a visitor id if the browser doesn't already have one.
  const incomingCookies = request.headers.get('cookie');
  let visitorId = readCookie(incomingCookies, VISITOR_COOKIE);
  if (!visitorId) {
    visitorId = randomUUID();
    res.cookies.set(VISITOR_COOKIE, visitorId, {
      ...cookieOpts,
      maxAge: 60 * 60 * 24 * VISITOR_DAYS,
    });
  }

  // Log the click. Service role bypasses RLS on referral_clicks. A failure
  // here must not block the redirect — the visitor still needs to land.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const db = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      await db.from('referral_clicks').insert({
        code,
        visitor_id: visitorId,
        landing_path: `/ref/${code}`,
        user_agent: request.headers.get('user-agent') ?? null,
        referer: request.headers.get('referer') ?? null,
      });
    } catch (err) {
      console.error('[ref] click insert failed:', err);
    }
  }

  return res;
}
