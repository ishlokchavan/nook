import type { SignalType } from './recommender';

/**
 * Best-effort behavioural event logging to the additive `discovery_events`
 * table. Fire-and-forget: never blocks the UI, swallows all errors, and no-ops
 * entirely when Supabase isn't configured (e.g. local dev / build).
 */

const STORAGE_KEY = 'closehq.glass.session.v1';

function sessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

function isConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function trackEvent(
  type: SignalType,
  reference: string,
  weight: number,
  dwellMs?: number,
): void {
  if (!isConfigured()) return;
  // Don't await — let it run in the background.
  void (async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('discovery_events').insert({
        session_id: sessionId(),
        reference,
        event_type: type,
        weight,
        dwell_ms: dwellMs ?? null,
      });
    } catch {
      /* network/RLS errors are non-fatal for the experience */
    }
  })();
}

/** Upsert the per-session affinity snapshot (fire-and-forget, debounced by caller). */
export function persistAffinity(affinity: Record<string, number>): void {
  if (!isConfigured()) return;
  void (async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase.from('discovery_affinity').upsert(
        {
          session_id: sessionId(),
          affinity,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id' },
      );
    } catch {
      /* non-fatal */
    }
  })();
}
