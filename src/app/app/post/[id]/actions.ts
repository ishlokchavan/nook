"use server";

import { createClient } from "@/lib/supabase/server";

export type UnlockResult =
  | { ok: true; phone: string }
  | { ok: false; error: "auth" | "insufficient_credits" | "unknown" };

/**
 * Server action wrapping the unlock_contact RPC. Runs as the signed-in user
 * (cookie-bound anon client), so the SECURITY DEFINER function sees the right
 * auth.uid(). Returns the phone on success, or a typed error for the UI.
 */
export async function unlockContactAction(
  supplierId: string,
): Promise<UnlockResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "auth" };

  const { data, error } = await supabase.rpc("unlock_contact", {
    p_supplier_id: supplierId,
  });

  if (error) {
    if (error.message.includes("insufficient_credits")) {
      return { ok: false, error: "insufficient_credits" };
    }
    return { ok: false, error: "unknown" };
  }

  return { ok: true, phone: String(data) };
}
