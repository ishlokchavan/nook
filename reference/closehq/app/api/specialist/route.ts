import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { specialistSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/mailer';

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

    const parsed = specialistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const { firstName, lastName, email, phone, message } = parsed.data;
    const userAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) {
        console.error('[specialist] Missing Supabase env vars');
      } else {
        const db = createClient(supabaseUrl, supabaseKey);
        const { error } = await db
          .from('specialist_applications')
          .insert({
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            message,
            status: 'pending',
            user_agent: userAgent,
            referer,
            consented_at: new Date().toISOString(),
          });
        if (error) console.error('[specialist] DB insert failed:', error.message);
      }
    } catch (err) {
      console.error('[specialist] DB insert failed:', err);
    }

    const notifyEmail = process.env.NOTIFY_EMAIL;

    // Confirmation email to specialist
    try {
      await sendEmail({
        to: email,
        subject: 'Application received. IClose Specialist',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f;">
            <p style="font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-0.02em;">Application received, ${firstName}.</p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;">
              We review every Specialist application personally. Our team will be in touch within a few days.
            </p>
            <p style="font-size:15px;color:#6e6e73;">, The iClose team</p>
            ${emailFooter()}
          </div>
        `,
      });
    } catch (err) {
      console.error('[specialist] confirmation email failed:', err);
    }

    // Admin notification, PII masked
    if (notifyEmail) {
      try {
        await sendEmail({
          to: notifyEmail,
          subject: `New Specialist application: ${firstName} ${lastName}`,
          html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;color:#1d1d1f;">
              <p style="font-size:18px;font-weight:600;margin-bottom:16px;">New Specialist application</p>
              <table style="width:100%;border-collapse:collapse;font-size:15px;">
                <tr><td style="padding:8px 0;color:#6e6e73;width:120px;">Name</td><td style="padding:8px 0;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Email</td><td style="padding:8px 0;">${maskEmail(email)}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Phone</td><td style="padding:8px 0;">${maskPhone(phone)}</td></tr>
                <tr><td style="padding:8px 0;color:#6e6e73;">Source</td><td style="padding:8px 0;">${referer ? new URL(referer).hostname : 'direct'}</td></tr>
              </table>
              <p style="font-size:15px;color:#6e6e73;margin-top:20px;margin-bottom:6px;"><strong style="color:#1d1d1f;">Expertise / Message</strong></p>
              <p style="font-size:15px;color:#1d1d1f;background:#f5f5f7;padding:16px;border-radius:8px;line-height:1.55;">${message}</p>
            </div>
          `,
        });
      } catch (err) {
        console.error('[specialist] admin notification failed:', err);
      }
    } else {
      console.warn('[specialist] NOTIFY_EMAIL not set. Skipping admin notification');
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Specialist API error:', err);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 },
    );
  }
}
