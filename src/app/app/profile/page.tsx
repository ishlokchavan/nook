import Link from "next/link";
import { LogIn } from "lucide-react";

import { ScreenHeader } from "@/components/app-shell/screen-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { createClient } from "@/lib/supabase/server";

/**
 * Profile tab. Auth-aware: signed-out users get a sign-in CTA (browsing stays
 * free, but the profile/account area needs an account); signed-in users see
 * their account and can sign out.
 */
export default async function ProfileScreen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let balance: number | null = null;
  if (user) {
    const { data } = await supabase.rpc("my_wallet_balance");
    balance = typeof data === "number" ? data : 0;
  }

  return (
    <div>
      <ScreenHeader title="Profile" />
      <div className="flex flex-col gap-4 px-4 pt-2">
        {user ? (
          <>
            <Card>
              <CardContent className="flex items-center gap-3 p-5">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                  {(user.email ?? "?").charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{user.email}</p>
                  <Pill variant="honey" className="mt-1">
                    Signed in
                  </Pill>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {balance ?? 0}{" "}
                    <span className="text-base font-medium text-muted-foreground">
                      credits
                    </span>
                  </p>
                </div>
                <Pill variant="outline">1 credit = 1 unlock</Pill>
              </CardContent>
            </Card>
            <form action="/auth/signout" method="post">
              <Button type="submit" variant="outline" className="w-full">
                Sign out
              </Button>
            </form>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <LogIn className="size-6" />
              </span>
              <p className="font-semibold">Sign in to Nook</p>
              <p className="text-sm text-muted-foreground">
                Browsing is free. Sign in to save projects, post requests and
                unlock contacts.
              </p>
              <Link
                href="/login?next=/app/profile"
                className={buttonVariants({ className: "w-full" })}
              >
                Sign in
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
