/**
 * Centralised, validated access to environment variables.
 * Throwing here turns a misconfigured deploy into a clear error instead of a
 * confusing runtime failure deep inside the Supabase client.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Copy .env.local.example to .env.local and fill it in.`,
    );
  }
  return value;
}

/**
 * Public env, exposed via getters so validation runs only when a value is
 * actually read (at request/interaction time) — never at module import. This
 * keeps `next build` from crashing when env isn't present in the build
 * environment (e.g. a preview deploy before env vars are configured); static
 * pages that don't touch Supabase still render.
 */
export const env = {
  get supabaseUrl(): string {
    return required(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    );
  },
  get supabaseAnonKey(): string {
    return required(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  },
};

/**
 * Server-only secret. Read lazily and ONLY from server code so the bundler
 * never ships it to the browser. Importing this from a Client Component will
 * throw at runtime because the variable is undefined there.
 */
export function getServiceRoleKey(): string {
  return required(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}
