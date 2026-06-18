import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
  connectionTimeout: 5_000,
  greetingTimeout: 5_000,
  socketTimeout: 8_000,
});

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
    throw new Error(
      'SMTP credentials missing (BREVO_SMTP_USER / BREVO_SMTP_KEY)',
    );
  }
  const from =
    process.env.BREVO_FROM_EMAIL ?? 'iClose <noreply.iclose@gmail.com>';
  await transporter.sendMail({ from, ...opts });
}
