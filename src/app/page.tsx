import Link from "next/link";
import { Hammer, Lock, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";

const features = [
  {
    icon: Hammer,
    title: "Real work, anonymously",
    body: "Browse an Instagram-style feed of real Dubai projects. Makers show their craft under handles like carpenter_568 — no spam, no cold calls.",
  },
  {
    icon: Lock,
    title: "Contact stays private",
    body: "Phone numbers are hidden until you choose to unlock. You're in control of who you reach out to and when.",
  },
  {
    icon: ShieldCheck,
    title: "Pay only when ready",
    body: "Browsing is free. Spend credits to unlock a contact, and get refunded if the number turns out to be dead.",
  },
];

export default function Home() {
  return (
    <main className="container flex flex-col items-center py-16 sm:py-24">
      <Pill variant="honey">Dubai · interiors marketplace</Pill>

      <h1 className="mt-6 max-w-3xl text-balance text-center text-4xl font-bold tracking-tight sm:text-6xl">
        Find the right maker for your space.
      </h1>

      <p className="mt-5 max-w-xl text-center text-lg text-muted-foreground">
        Nook connects Dubai homeowners with carpenters, contractors and interior
        designers — through their work, not their sales pitch.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/login" className={buttonVariants({ size: "lg" })}>
          Get started
        </Link>
        <Link
          href="/app"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Browse the feed
        </Link>
      </div>

      <div className="mt-20 grid w-full max-w-4xl gap-5 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardContent className="flex flex-col gap-3 p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
