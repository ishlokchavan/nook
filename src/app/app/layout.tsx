import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

/**
 * Layout for the authenticated area. Middleware already redirects
 * unauthenticated users, but we re-check here as defence in depth — never
 * trust the edge alone to gate a Server Component tree.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/app");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/app" className="text-lg font-bold tracking-tight">
            Nook
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="container flex-1 py-8">{children}</div>
    </div>
  );
}
