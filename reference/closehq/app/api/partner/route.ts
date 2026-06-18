import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { partnerSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/mailer';

const emailFooter = () => {
  const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@iclose.ae';
  return `
  <hr style="border:none;border-top:1px solid #d2d2d7;margin:32px 0;"/>
  <p style="font-size:11px;color:#a1a1a6;line-height:1.6;">
    iClose · Dubai, UAE · <a href="https://iclose.ae" style="color:#0071e3;text-decoration:none;">iclose.ae</a><br/>
    You received this because you applied to the iClose Partner programme.
    To unsubscribe or request data removal, email <a href="mailto:${contact}" style="color:#0071e3;">${contact}</a>.
  </p>
`;
};

const generateCode = (name: string) => {
  const slug = name
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 24);
  const suffix = Math.random().toString(36).toUpperCase().slice(2, 6);
  return (slug || 'PARTNER') + '-' + suffix;
};

const maskEmail = (e: string) => {
  const [local, domain] = e.split('@');
  return `${local.slice(0, 2)}${'*'.repeat(Math.max(local.length - 2, 3))}@${domain}`;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = partnerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Honeypot
    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const { name, email, phone, consentMarketing } = parsed.data;
    const userAgent = request.headers.get('user-agent') || null;
    const referer = request.headers.get('referer') || null;
    const origin = new URL(request.url).origin;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
      console.error('[partner] Missing Supabase env vars');
      return NextResponse.json(
        { error: 'Server misconfigured. Please contact support.' },
        { status: 500 },
      );
    }

    const db = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Reserve a unique code across the shared referral namespace: it must
    // collide with neither another partner nor a member referral_code. The
    // random suffix makes collisions vanishingly rare; we retry a few times
    // just in case.
    let code = generateCode(name);
    for (let attempt = 0; attempt < 4; attempt++) {
      const [{ data: partnerClash }, { data: memberClash }] = await Promise.all([
        db.from('partners').select('id').ilike('code', code).maybeSingle(),
        db.from('leads').select('id').ilike('referral_code', code).maybeSingle(),
      ]);
      if (!partnerClash && !memberClash) break;
      code = generateCode(name);
    }

    const { data: inserted, error: insertError } = await db
      .from('partners')
      .insert({
        name,
        email,
        phone,
        code,
        status: 'active',
        consent_marketing: consentMarketing ?? false,
        consented_at: new Date().toISOString(),
        user_agent: userAgent,
        referer,
      })
      .select('id, code, verification_token')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        const msg = /email/i.test(insertError.message)
          ? "That email already has a partner account. Check your inbox for the verification link."
          : "It looks like you're already signed up.";
        return NextResponse.json({ error: msg }, { status: 409 });
      }
      console.error('[partner] DB insert failed:', insertError.message);
      return NextResponse.json(
        { error: "We couldn't create your partner account. Please try again." },
        { status: 500 },
      );
    }

    const verifyUrl = `${origin}/api/verify?token=${inserted.verification_token}&type=partner`;

    // Verification email to partner
    try {
      await sendEmail({
        to: email,
        subject: 'Confirm your iClose Partner email',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f;">
            <p style="font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-0.02em;">Welcome, ${name}.</p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;">
              You've joined the iClose Partner programme. Confirm your email to activate your referral link.
            </p>
            <a href="${verifyUrl}" style="display:inline-block;margin-bottom:24px;padding:14px 28px;background:#1d1d1f;color:#ffffff;border-radius:100px;font-size:15px;font-weight:500;text-decoration:none;letter-spacing:-0.01em;">
              Confirm my email
            </a>
            <p style="font-size:13px;color:#a1a1a6;margin-bottom:20px;">Or copy this link: <a href="${verifyUrl}" style="color:#0071e3;">${verifyUrl}</a></p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:28px;letter-spacing:-0.01em;">
              Once confirmed, share your link and track everyone you bring to iClose.
            </p>
            <p style="font-size:15px;color:#6e6e73;">, The iClose team</p>
            ${emailFooter()}
          </div>
        `,
      });
    } catch (err) {
      console.error('[partner] verification email failed:', err);
    }

    // Admin notification
    const notifyEmail = process.env.NOTIFY_EMAIL;
    if (notifyEmail) {
      try {
        await sendEmail({
          to: notifyEmail,
          subject: `New Partner signup: ${name}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;color:#1d1d1f;">
              <p style="font-size:18px;font-weight:600;margin-bottom:16px;">New Partner signup</p>
              <table style="width:100%;border-collapse:collapse;font-size:15px;">
                <tr><td style="padding:8px 0;color:#6e6e73;width:120px;">Name</td><td style="padding:8px 0;">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Email</td><td style="padding:8px 0;">${maskEmail(email)}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Code</td><td style="padding:8px 0;">${inserted.code}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Status</td><td style="padding:8px 0;">Pending email confirmation</td></tr>
              </table>
            </div>
          `,
        });
      } catch (err) {
        console.error('[partner] admin notification failed:', err);
      }
    }

    return NextResponse.json({ ok: true, code: inserted.code });
  } catch (err) {
    console.error('Partner API error:', err);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 },
    );
  }
}
