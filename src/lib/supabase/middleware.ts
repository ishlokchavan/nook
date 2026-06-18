import { NextResponse, type NextRequest } from "next/server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { env } from "@/lib/env";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Refreshes the Supabase auth session on every request and guards `/app/*`.
 *
 * Returns the (possibly cookie-mutated) response. IMPORTANT: do not run
 * arbitrary logic between creating the client and calling `getUser()` — see
 * the Supabase SSR docs on token refresh.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Defence: middleware runs on every route. If Supabase env isn't configured
  // (e.g. a preview deploy before env vars are set), skip session handling
  // rather than throwing — a missing key must never take the whole site down.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return supabaseResponse;
  }

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The whole /app shell is PUBLIC (clients browse free). Tabs that need an
  // account show an inline sign-in prompt rather than bouncing the user out of
  // the app, so middleware only hard-redirects genuinely sensitive areas (e.g.
  // the future admin console). Everything else just gets its cookie refreshed.
  const PROTECTED_PREFIXES = ["/admin"];
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
