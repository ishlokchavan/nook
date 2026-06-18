import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const type = searchParams.get('type'); // 'member' | 'educator'

  const origin = new URL(request.url).origin;

  if (!token || !type) {
    return NextResponse.redirect(`${origin}/verify?status=invalid`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.redirect(`${origin}/verify?status=invalid`);
  }
  const db = createClient(supabaseUrl, supabaseKey);

  // Admin client for creating auth users (service role bypasses RLS)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminDb = serviceKey ? createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  }) : null;

  const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

  if (type === 'member') {
    const { data, error } = await db
      .from('leads')
      .select('id, first_name, email, is_verified, created_at')
      .eq('verification_token', token)
      .single();

    if (error || !data) {
      return NextResponse.redirect(`${origin}/verify?status=invalid`);
    }
    if (data.is_verified) {
      return NextResponse.redirect(`${origin}/verify?status=already`);
    }
    if (Date.now() - new Date(data.created_at).getTime() > TOKEN_TTL_MS) {
      return NextResponse.redirect(`${origin}/verify?status=expired`);
    }

    await db
      .from('leads')
      .update({ is_verified: true, verified_at: new Date().toISOString() })
      .eq('verification_token', token);

    // Provision a Supabase Auth user. Triggers handle_new_user() → profiles insert
    if (adminDb) {
      try {
        const { data: created, error: authError } = await adminDb.auth.admin.createUser({
          email: data.email,
          email_confirm: true,
          user_metadata: { full_name: data.first_name },
        });

        let userId: string | null = created?.user?.id ?? null;

        if (!userId && authError?.message.includes('already been registered')) {
          // User pre-exists. Find their ID via SECURITY DEFINER function
          const { data: existingId } = await adminDb.rpc('get_auth_user_id_by_email', { p_email: data.email });
          userId = existingId ?? null;
        } else if (authError && !authError.message.includes('already been registered')) {
          console.error('[member] auth user creation failed:', authError.message);
        }

        // Ensure a profile row exists (ignoreDuplicates so we never downgrade an existing role)
        if (userId) {
          await adminDb.from('profiles').upsert(
            { id: userId, full_name: data.first_name, role: 'learner' },
            { onConflict: 'id', ignoreDuplicates: true },
          );
        }
      } catch (err) {
        console.error('[member] auth provisioning failed:', err);
      }
    }

    // Send welcome email confirming verification
    try {
      await sendEmail({
        to: data.email,
        subject: 'Email confirmed. Welcome to iClose',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f;">
            <p style="font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-0.02em;">You're confirmed, ${data.first_name}.</p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;">
              Your email is verified. You're on the founding cohort list. We'll send your iClose Academy login credentials before launch.
            </p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:28px;letter-spacing:-0.01em;">
              Questions? Reply to this email and we'll get back to you.
            </p>
            <p style="font-size:15px;color:#6e6e73;">, The iClose team</p>
            ${emailFooter()}
          </div>
        `,
      });
    } catch (_) {}

    return NextResponse.redirect(`${origin}/verify?status=success&type=member`);
  }

  if (type === 'partner') {
    // partners has RLS on with no anon SELECT policy, so we read + write via
    // the service-role client. The verification_token in the URL is itself
    // the secret that authorises this call.
    if (!adminDb) {
      console.error('[partner] SUPABASE_SERVICE_ROLE_KEY missing');
      return NextResponse.redirect(`${origin}/verify?status=invalid`);
    }

    const { data, error } = await adminDb
      .from('partners')
      .select('id, name, email, code, is_verified, created_at, user_id')
      .eq('verification_token', token)
      .single();

    if (error || !data) {
      return NextResponse.redirect(`${origin}/verify?status=invalid`);
    }
    if (data.is_verified) {
      return NextResponse.redirect(
        `${origin}/verify?status=already&type=partner&code=${data.code}`,
      );
    }
    if (Date.now() - new Date(data.created_at).getTime() > TOKEN_TTL_MS) {
      return NextResponse.redirect(`${origin}/verify?status=expired`);
    }

    await adminDb
      .from('partners')
      .update({ is_verified: true, verified_at: new Date().toISOString() })
      .eq('verification_token', token);

    // Silently provision an auth user so the partner can log into the
    // dashboard later — no Supabase email is sent because email_confirm:true
    // bypasses the confirmation flow.
    if (!data.user_id) {
      try {
        const { data: created, error: authError } =
          await adminDb.auth.admin.createUser({
            email: data.email,
            email_confirm: true,
            user_metadata: { full_name: data.name, role: 'partner' },
          });

        let userId: string | null = created?.user?.id ?? null;

        if (
          !userId &&
          authError?.message.includes('already been registered')
        ) {
          const { data: existingId } = await adminDb.rpc(
            'get_auth_user_id_by_email',
            { p_email: data.email },
          );
          userId = existingId ?? null;
        } else if (
          authError &&
          !authError.message.includes('already been registered')
        ) {
          console.error(
            '[partner] auth user creation failed:',
            authError.message,
          );
        }

        if (userId) {
          await adminDb
            .from('partners')
            .update({ user_id: userId })
            .eq('id', data.id);
        }
      } catch (err) {
        console.error('[partner] auth provisioning failed:', err);
      }
    }

    try {
      const partnerLink = `${origin}/ref/${data.code}`;
      await sendEmail({
        to: data.email,
        subject: 'Your iClose Partner link is live',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f;">
            <p style="font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-0.02em;">You're in, ${data.name}.</p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;">
              Your referral link is active. Share it anywhere — every click and signup is tracked back to you.
            </p>
            <p style="font-size:15px;color:#1d1d1f;font-weight:500;margin-bottom:8px;">Your link</p>
            <p style="font-size:17px;margin-bottom:24px;"><a href="${partnerLink}" style="color:#0071e3;">${partnerLink}</a></p>
            <p style="font-size:15px;color:#6e6e73;">, The iClose team</p>
            ${emailFooter()}
          </div>
        `,
      });
    } catch (_) {}

    return NextResponse.redirect(
      `${origin}/verify?status=success&type=partner&code=${data.code}`,
    );
  }

  if (type === 'educator') {
    const { data, error } = await db
      .from('educators')
      .select('id, first_name, email, is_verified')
      .eq('verification_token', token)
      .single();

    if (error || !data) {
      return NextResponse.redirect(`${origin}/verify?status=invalid`);
    }
    if (data.is_verified) {
      return NextResponse.redirect(`${origin}/verify?status=already`);
    }

    await db
      .from('educators')
      .update({ is_verified: true, verified_at: new Date().toISOString() })
      .eq('verification_token', token);

    try {
      await sendEmail({
        to: data.email,
        subject: 'Application confirmed. IClose Specialist',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f;">
            <p style="font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-0.02em;">Email confirmed, ${data.first_name}.</p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;">
              Your Specialist application is confirmed and under review. We review every application personally and will be in touch within a few days.
            </p>
            <p style="font-size:15px;color:#6e6e73;">, The iClose team</p>
            ${emailFooter()}
          </div>
        `,
      });
    } catch (_) {}

    return NextResponse.redirect(`${origin}/verify?status=success&type=educator`);
  }

  return NextResponse.redirect(`${origin}/verify?status=invalid`);
}
