import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { internSchema } from '@/lib/validations';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const fields = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      instagram: (formData.get('instagram') as string) || undefined,
      message: (formData.get('message') as string) || undefined,
      website: (formData.get('website') as string) || undefined,
    };

    const parsed = internSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    if (parsed.data.website && parsed.data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const { firstName, lastName, email, phone, instagram, message } = parsed.data;
    const resumeFile = formData.get('resume') as File | null;
    const userAgent = request.headers.get('user-agent') || undefined;
    const referer = request.headers.get('referer') || undefined;

    let resumePath: string | undefined;

    // Upload resume to Supabase Storage
    if (resumeFile && resumeFile.size > 0) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !serviceKey) {
          console.error('[intern] Missing Supabase env vars for storage');
        } else {
          const db = createClient(supabaseUrl, serviceKey);
          const ext = resumeFile.name.split('.').pop() || 'pdf';
          const path = `${crypto.randomUUID()}.${ext}`;
          const bytes = await resumeFile.arrayBuffer();
          const { error } = await db.storage
            .from('resumes')
            .upload(path, bytes, { contentType: 'application/pdf' });
          if (error) {
            console.error('[intern] Resume upload failed:', error.message);
          } else {
            resumePath = path;
          }
        }
      } catch (err) {
        console.error('[intern] Resume upload failed:', err);
      }
    }

    // Insert into DB
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!supabaseUrl || !serviceKey) {
        console.error('[intern] Missing Supabase env vars');
      } else {
        const db = createClient(supabaseUrl, serviceKey);
        const { error } = await db.from('intern_applications').insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          instagram: instagram || null,
          message: message || null,
          resume_path: resumePath || null,
          status: 'pending',
          user_agent: userAgent,
          referer,
        });
        if (error) console.error('[intern] DB insert failed:', error.message);
      }
    } catch (err) {
      console.error('[intern] DB insert failed:', err);
    }

    const notifyEmail = process.env.NOTIFY_EMAIL || 'ishlokchavan@gmail.com';

    // Confirmation email to applicant
    try {
      await sendEmail({
        to: email,
        subject: 'Application received. IClose Internship',
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1d1d1f;">
            <p style="font-size:24px;font-weight:600;margin-bottom:8px;letter-spacing:-0.02em;">Application received, ${firstName}.</p>
            <p style="font-size:17px;color:#6e6e73;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;">
              Thanks for applying to the iClose internship programme. We review every application personally and will be in touch within a few days.
            </p>
            <p style="font-size:15px;color:#6e6e73;">, The iClose team</p>
            <hr style="border:none;border-top:1px solid #d2d2d7;margin:32px 0;"/>
            <p style="font-size:12px;color:#a1a1a6;">iClose · Dubai, UAE · <a href="https://iclose.ae" style="color:#0071e3;text-decoration:none;">iclose.ae</a></p>
          </div>
        `,
      });
    } catch (err) {
      console.error('[intern] confirmation email failed:', err);
    }

    // Admin notification
    try {
      await sendEmail({
        to: notifyEmail,
        subject: `New Intern application: ${firstName} ${lastName}`,
        html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;color:#1d1d1f;">
            <p style="font-size:18px;font-weight:600;margin-bottom:16px;">New Intern application</p>
            <table style="width:100%;border-collapse:collapse;font-size:15px;">
              <tr><td style="padding:8px 0;color:#6e6e73;width:100px;">Name</td><td style="padding:8px 0;">${firstName} ${lastName}</td></tr>
              <tr><td style="padding:8px 0;color:#6e6e73;">Email</td><td style="padding:8px 0;">${email}</td></tr>
              <tr><td style="padding:8px 0;color:#6e6e73;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>
              ${instagram ? `<tr><td style="padding:8px 0;color:#6e6e73;">Instagram</td><td style="padding:8px 0;">@${instagram.replace(/^@/, '')}</td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#6e6e73;">Source</td><td style="padding:8px 0;">${referer || 'direct'}</td></tr>
              ${resumePath ? `<tr><td style="padding:8px 0;color:#6e6e73;">CV</td><td style="padding:8px 0;">Uploaded. Check Supabase Storage &rarr; resumes/${resumePath}</td></tr>` : '<tr><td style="padding:8px 0;color:#6e6e73;">CV</td><td style="padding:8px 0;">Not uploaded</td></tr>'}
            </table>
            ${message ? `<p style="font-size:15px;color:#6e6e73;margin-top:20px;margin-bottom:6px;"><strong style="color:#1d1d1f;">Message</strong></p><p style="font-size:15px;color:#1d1d1f;background:#f5f5f7;padding:16px;border-radius:8px;line-height:1.55;">${message}</p>` : ''}
          </div>
        `,
      });
    } catch (err) {
      console.error('[intern] admin notification failed:', err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Intern API error:', err);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 },
    );
  }
}
