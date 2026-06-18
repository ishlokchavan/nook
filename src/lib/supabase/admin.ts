import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env, getServiceRoleKey } from "@/lib/env";

/**
 * Privileged Supabase client using the SERVICE ROLE key. This BYPASSES RLS.
 *
 * The `server-only` import above makes the bundler throw if this module is
 * ever imported into a Client Component, keeping the secret off the browser.
 *
 * Use sparingly — only for trusted server-side operations (moderation,
 * admin tooling, edge-function logic). Never use it to satisfy a request on
 * behalf of an untrusted client.
 */
export function createAdminClient() {
  return createSupabaseClient(env.supabaseUrl, getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
