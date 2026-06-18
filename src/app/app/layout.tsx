import { TabBar } from "@/components/app-shell/tab-bar";

/**
 * The installable Nook app experience. A centred phone-frame shell (max 520px)
 * with ambient honey/ink colour washes and a floating glass tab bar — adapted
 * from closehq's (glass) layout, restyled to Nook.
 *
 * This area is PUBLIC: clients browse the feed free (per the brief). Individual
 * actions that need an account (saving, posting a request, unlocking contact)
 * gate themselves; the shell does not.
 */
export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-[100svh] w-full justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute -left-40 top-0 h-[55vh] w-[55vh] rounded-full bg-primary/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[55vh] w-[55vh] rounded-full bg-primary/15 blur-[130px]" />

      <main className="relative flex h-[100svh] w-full max-w-[520px] flex-col overflow-hidden bg-card text-foreground shadow-[0_0_80px_rgba(28,27,25,0.12)]">
        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain pb-24">
          {children}
        </div>
        <TabBar />
      </main>
    </div>
  );
}
