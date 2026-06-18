import { NextResponse } from 'next/server';
import { listingCreateSchema } from '@/lib/portal/listing-create-schema';

/**
 * Listing intake. Validates the submission and returns a reference with
 * status "pending_review". Listings never auto-publish — a compliance review
 * gates going live (RERA / Trakheesi verification, ownership checks).
 *
 * TODO (gated on decisions / DB write being enabled):
 *  - persist to `listings` with status='pending_review' + listing_translations
 *  - upload documents to Supabase Storage and link them
 *  - anti-misuse enforcement: cap active listings per account; de-dupe by
 *    phone/email across owner-listings; verify owner name vs Emirates ID
 *  - Trakheesi permit verification before publish
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = listingCreateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot — silently accept bots without doing anything.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, reference: 'IC-PENDING', status: 'pending_review' });
  }

  const reference = `IC-${Math.floor(100000 + Math.random() * 900000)}`;

  // Persistence + document upload + anti-misuse checks happen here once the
  // listings table + storage are enabled and the compliance rules are confirmed.

  return NextResponse.json({ ok: true, reference, status: 'pending_review' });
}
