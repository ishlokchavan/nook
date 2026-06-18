import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { leadSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/mailer';
import { generateReferralCode, isValidReferralCode } from '@/lib/referral';

async function reserveReferralCode(db: SupabaseClient): Promise<string> {
  // Re-roll on the (vanishingly rare) collision. We don't insert here;
  // the row insert that follows will catch any duplicate on the unique
  // constraint and we'll just regenerate.
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = generateReferralCode(8);
    const { data, error } = await db
      .from('leads')
      .select('id')
      .eq('referral_code', code)
      .limit(1)
      .maybeSingle();
    if (error) {
      // The column may not exist yet — fall back to a one-shot code.
      return code;
    }
    if (!data) return code;
  }
  return generateReferralCode(10);
}

const emailFooter = () => {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@iclose.ae';
  return `
  <hr style="border:none;border-top:1px solid #d2d2d7;margin:32px 0;"/>
  <p style="font-size:11px;color:#a1a1a6;line-height:1.6;">
    iClose · Dubai, UAE · <a href="https://iclose.ae" style="color:#0071e3;text-decoration:none;">iclose.ae</a><br/>
    You received this because you submitted a form at iclose.ae.
    To unsubscribe or request data removal, email <a href="mailto:${contact}" style="color:#0071e3;">${contact}</a>.
  </p>
`};

const maskEmail = (e: string) => {
  const [local, domain] = e.split('@');
  return `${local.slice(0, 2)}${'*'.repeat(Math.max(local.length - 2, 3))}@${domain}`;
};
const maskPhone = (p: string) => `****${p.replace(/\D/g, '').slice(-4)}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const {
      firstName,
      lastName,
      phone,
      email,
      consentMarketing,
      jobTitle,
      intent,
      focus,
      dealTypes,
      message,
      referredByCode: referredByRaw,
    } = parsed.data;
    const referredByCode =
      referredByRaw && isValidReferralCode(referredByRaw)
        ? referredByRaw.toUpperCase()
        : null;
    /* `focus` accepts both a single enum (legacy form) and an array
       (waitlist). Normalise to a string[] for the focus column. */
    const focusArray: string[] = Array.isArray(focus)
      ? focus
      : focus
        ? [focus]
        : [];
    const focusLabels: Record<string, string> = {
      offplan: 'Offplan',
      secondary: 'Secondary',
      both: 'Both',
    };
    const dealTypeLabels: Record<string, string> = {
      apartments: 'Apartments',
      villas: 'Villas',
      townhouses: 'Townhouses',
      commercial: 'Commercial',
      other: 'Other',
    };
    const focusLabel =
      focusArray.length > 0
        ? focusArray.map((f) => focusLabels[f] ?? f).join(', ')
        : ', ';
    const dealTypesLabel =
      dealTypes && dealTypes.length
        ? dealTypes.map((d) => dealTypeLabels[d] ?? d).join(', ')
        : ', ';
    const escapeHtml = (s: string) =>
      s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    const name = `${firstName} ${lastName}`.trim();
    const userAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;
    const origin = new URL(request.url).origin;
    const verificationToken = randomUUID();
    let issuedReferralCode: string | null = null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      console.error('[member] Missing Supabase env vars');
      return NextResponse.json(
        { error: 'Server misconfigured. Please contact support.' },
        { status: 500 },
      );
    }

    try {
      const db = createClient(supabaseUrl, supabaseKey);

      let referredByLeadId: string | null = null;
      if (referredByCode) {
        const { data: referrer, error: refErr } = await db
          .from('leads')
          .select('id')
          .eq('referral_code', referredByCode)
          .limit(1)
          .maybeSingle();
        if (refErr) {
          // referral_code column may not exist yet, ignore quietly.
          console.warn(
            '[member] referrer lookup failed (likely schema):',
            refErr.message,
          );
        } else if (referrer) {
          referredByLeadId = referrer.id as string;
        }
      }

      issuedReferralCode = await reserveReferralCode(db);

      const baseRow: Record<string, unknown> = {
        name,
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        plan_key: 'plus',
        source: 'landing_page',
        user_agent: userAgent,
        referer,
        verification_token: verificationToken,
        consent_marketing: consentMarketing ?? false,
        consented_at: new Date().toISOString(),
        referral_code: issuedReferralCode,
        referred_by_code: referredByCode,
        referred_by_lead_id: referredByLeadId,
        intent: intent ?? null,
        focus: focusArray.length > 0 ? focusArray : null,
      };

      /* Insert and ask for the persisted row back. We then trust the
         referral_code from the row, not the one we generated locally,
         so we can never hand the user a code that isn't actually in
         the DB. (Fixes a prior silent-failure bug where a duplicate
         phone returned ok:true with an unsaved code.) */
      let insertResult = await db
        .from('leads')
        .insert(baseRow)
        .select('id, referral_code')
        .single();

      if (
        insertResult.error &&
        /column|schema cache/i.test(insertResult.error.message)
      ) {
        /* Newer columns missing (pre-migration). Retry without the
           full new set so we still capture the lead. Strips both the
           referral columns and the intent/focus columns. */
        console.warn(
          '[member] newer columns missing, retrying without them',
        );
        const fallback = { ...baseRow };
        delete fallback.referral_code;
        delete fallback.referred_by_code;
        delete fallback.referred_by_lead_id;
        delete fallback.intent;
        delete fallback.focus;
        insertResult = await db
          .from('leads')
          .insert(fallback)
          .select('id')
          .single();
        issuedReferralCode = null;
      }

      if (insertResult.error) {
        const dbErr = insertResult.error;
        // Postgres unique-violation. Surface a friendly message so
        // the user knows they're already in our system instead of
        // getting a fake success that strands them.
        if (dbErr.code === '23505') {
          const msg = /phone/i.test(dbErr.message)
            ? 'That phone number is already on our list. Try a different one, or use the email you originally signed up with.'
            : /email/i.test(dbErr.message)
              ? 'That email is already on our list.'
              : "It looks like you're already on our list.";
          return NextResponse.json({ error: msg }, { status: 409 });
        }
        console.error('[member] DB insert failed:', dbErr.message);
        return NextResponse.json(
          { error: "We couldn't save your details. Please try again." },
          { status: 500 },
        );
      }

      // Trust the persisted code if the row came back with one.
      const persistedCode =
        (insertResult.data as { referral_code?: string | null } | null)
          ?.referral_code ?? null;
      if (persistedCode) issuedReferralCode = persistedCode;

      /* referral_count is maintained by a DB trigger on the academy
         side (AFTER INSERT/DELETE on leads). We used to bump it from
         here too, which double-counted on insert and stayed stale on
         delete. The bump_referral_count RPC the earlier migration
         shipped is still in place for backfills/admin use, but the
         hot path no longer calls it. */

      /* Partner attribution. referred_by_code is one shared namespace —
         if a partner happens to own this code, record the conversion
         so the academy's partner dashboard can show it. Lookup is
         case-insensitive via the upper(code) unique index; everything
         we write is already uppercased. Service role bypasses RLS on
         partners + referral_conversions + referral_clicks. Failure
         here must not fail the lead signup. */
      const leadId = (insertResult.data as { id?: string } | null)?.id ?? null;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (referredByCode && leadId && serviceKey) {
        try {
          const adminDb = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
          });
          const { data: partner } = await adminDb
            .from('partners')
            .select('id')
            .ilike('code', referredByCode)
            .maybeSingle();
          if (partner?.id) {
            await adminDb.from('referral_conversions').insert({
              partner_id: partner.id,
              converted_user_id: leadId,
              type: 'signup',
            });
            /* Best-effort click backfill. Prefer the click whose
               visitor_id matches the iclose_vid cookie we set on /ref
               — that's the click that actually drove this signup. If
               no match (cookie cleared, fresh device, etc.), fall back
               to the most-recent unconverted click for the code. */
            const visitorId =
              request.headers
                .get('cookie')
                ?.split('; ')
                .find((c) => c.startsWith('iclose_vid='))
                ?.split('=')[1] ?? null;
            let clickQuery = adminDb
              .from('referral_clicks')
              .select('id')
              .ilike('code', referredByCode)
              .is('converted_lead_id', null);
            if (visitorId) clickQuery = clickQuery.eq('visitor_id', visitorId);
            const { data: lastClick } = await clickQuery
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            if (lastClick?.id) {
              await adminDb
                .from('referral_clicks')
                .update({ converted_lead_id: leadId })
                .eq('id', lastClick.id);
            }
          }
        } catch (err) {
          console.error('[member] partner attribution failed:', err);
        }
      }
    } catch (err) {
      console.error('[member] DB insert failed:', err);
      return NextResponse.json(
        { error: "We couldn't save your details. Please try again." },
        { status: 500 },
      );
    }

    const notifyEmail = process.env.NOTIFY_EMAIL;
    const verifyUrl = `${origin}/api/verify?token=${verificationToken}&type=member`;

    // Verification email to member
    try {
      await sendEmail({
        to: email,
        subject: "You're in. Confirm your iClose email",
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f;">
            <p style="font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-0.02em;">Welcome, ${firstName}.</p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;">
              You've joined the iClose founding cohort as a <strong style="color:#1d1d1f;">Member</strong>. One last step. Confirm your email to secure your place.
            </p>
            <a href="${verifyUrl}" style="display:inline-block;margin-bottom:24px;padding:14px 28px;background:#1d1d1f;color:#ffffff;border-radius:100px;font-size:15px;font-weight:500;text-decoration:none;letter-spacing:-0.01em;">
              Confirm my email
            </a>
            <p style="font-size:13px;color:#a1a1a6;margin-bottom:20px;">Or copy this link: <a href="${verifyUrl}" style="color:#0071e3;">${verifyUrl}</a></p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:28px;letter-spacing:-0.01em;">
              Founding members get first access and locked-in terms.
            </p>
            <p style="font-size:15px;color:#6e6e73;">, The iClose team</p>
            ${emailFooter()}
          </div>
        `,
      });
    } catch (err) {
      console.error('[member] verification email failed:', err);
    }

    // Admin notification, PII masked
    if (notifyEmail) {
      try {
        await sendEmail({
          to: notifyEmail,
          subject: `New Member signup: ${name}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;color:#1d1d1f;">
              <p style="font-size:18px;font-weight:600;margin-bottom:16px;">New Member signup</p>
              <table style="width:100%;border-collapse:collapse;font-size:15px;">
                <tr><td style="padding:8px 0;color:#6e6e73;width:120px;">Name</td><td style="padding:8px 0;">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Email</td><td style="padding:8px 0;">${maskEmail(email)}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Phone</td><td style="padding:8px 0;">${maskPhone(phone)}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Job title</td><td style="padding:8px 0;">${jobTitle ? escapeHtml(jobTitle) : ', '}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Focus</td><td style="padding:8px 0;">${focusLabel}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Deal types</td><td style="padding:8px 0;">${dealTypesLabel}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;vertical-align:top;">Notes</td><td style="padding:8px 0;white-space:pre-wrap;">${message ? escapeHtml(message) : ', '}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Marketing</td><td style="padding:8px 0;">${consentMarketing ? 'Opted in' : 'Not opted in'}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Source</td><td style="padding:8px 0;">${referer ? new URL(referer).hostname : 'direct'}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Referred by</td><td style="padding:8px 0;">${referredByCode || ','}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Their code</td><td style="padding:8px 0;">${issuedReferralCode || ','}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Status</td><td style="padding:8px 0;">Pending email confirmation</td></tr>
              </table>
            </div>
          `,
        });
      } catch (err) {
        console.error('[member] admin notification failed:', err);
      }
    } else {
      console.warn('[member] NOTIFY_EMAIL not set. Skipping admin notification');
    }

    return NextResponse.json({
      ok: true,
      referralCode: issuedReferralCode,
    });
  } catch (err) {
    console.error('Lead API error:', err);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 },
    );
  }
}
