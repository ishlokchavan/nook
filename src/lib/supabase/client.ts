"use client";

import { createBrowserClient } from "@supabase/ssr";

import { env } from "@/lib/env";

/**
 * Browser Supabase client (anon key). Use inside Client Components for
 * interactive auth flows. Reads/writes are still governed by RLS, so this
 * client can never see private fields like `suppliers.contact_phone`.
 */
export function createClient() {
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
