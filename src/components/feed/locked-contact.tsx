"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Lock, Phone } from "lucide-react";

import { unlockContactAction } from "@/app/app/post/[id]/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * The locked-contact control — the product's paywall, client-side.
 * Signed-out users are routed to sign in. Signed-in users unlock via the
 * server action, which calls the unlock_contact RPC (the only path that can
 * read a supplier's phone number).
 */
export function LockedContact({
  supplierId,
  isSignedIn,
  backHref,
}: {
  supplierId: string;
  isSignedIn: boolean;
  backHref: string;
}) {
  const [phone, setPhone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function unlock() {
    setError(null);
    startTransition(async () => {
      const res = await unlockContactAction(supplierId);
      if (res.ok) {
        setPhone(res.phone);
      } else if (res.error === "insufficient_credits") {
        setError("Not enough credits. Top up to unlock.");
      } else if (res.error === "auth") {
        setError("Please sign in to unlock.");
      } else {
        setError("Couldn't unlock right now. Try again.");
      }
    });
  }

  if (phone) {
    return (
      <Card className="border-primary/40">
        <CardContent className="flex items-center gap-3 p-5">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Phone className="size-5" />
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Contact unlocked</p>
            <a href={`tel:${phone}`} className="text-lg font-bold tracking-tight">
              {phone}
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <Lock className="size-5" />
        </span>
        <div>
          <p className="font-semibold">Contact is locked</p>
          <p className="text-sm text-muted-foreground">
            Reach this maker directly. Unlock to reveal their number — refunded
            if it&apos;s a dead line.
          </p>
        </div>
        {isSignedIn ? (
          <Button className="w-full" onClick={unlock} disabled={pending}>
            {pending ? "Unlocking…" : "Unlock contact · 1 credit"}
          </Button>
        ) : (
          <Link
            href={`/login?next=${encodeURIComponent(backHref)}`}
            className={buttonVariants({ className: "w-full" })}
          >
            Sign in to unlock
          </Link>
        )}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
