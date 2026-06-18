"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const supabase = createClient();
    const emailRedirectTo = `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("sent");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in to Nook</CardTitle>
        <CardDescription>
          We&apos;ll email you a magic link — no password needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "sent" ? (
          <p className="text-sm text-muted-foreground">
            Check <span className="font-medium text-foreground">{email}</span>{" "}
            for a link to finish signing in. You can close this tab.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <Button type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send magic link"}
            </Button>
            {status === "error" && (
              <p className="text-sm text-destructive" role="alert">
                {message}
              </p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="container flex min-h-dvh flex-col items-center justify-center gap-6 py-16">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        Nook
      </Link>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
