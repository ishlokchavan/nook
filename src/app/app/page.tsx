import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";

/**
 * Placeholder home for the authenticated area. The real project feed lands in
 * Milestone 3 once the schema (Milestone 2) exists.
 */
export default function AppHome() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Pill variant="honey">You&apos;re signed in</Pill>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Nook</h1>
        <p className="text-muted-foreground">
          The scaffold is live. Next up: the database schema, RLS policies and
          the project feed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What&apos;s coming next</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm text-muted-foreground">
          <p>· Milestone 2 — schema, RLS policies, the unlock_contact RPC, seed data</p>
          <p>· Milestone 3 — the browseable project feed with locked contacts</p>
          <p>· Milestone 4 — supplier onboarding, posts, image moderation</p>
        </CardContent>
      </Card>
    </div>
  );
}
