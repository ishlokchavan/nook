import { cookies } from "next/headers";

import { createServerClient, type CookieOptions } from "@supabase/ssr";

import { env } from "@/lib/env";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Server Supabase client (anon key, acting as the signed-in user via cookies).
 * Use in Server Components, Route Handlers and Server Actions. Subject to RLS.
 *
 * Next 15: `cookies()` is async, so this returns a promise.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // `setAll` was called from a Server Component. This can be ignored
          // when middleware is refreshing the session (see middleware.ts).
        }
      },
    },
  });
}
