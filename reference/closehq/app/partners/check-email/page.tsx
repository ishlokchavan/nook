export default function CheckEmailPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold mb-3">Check your email.</h1>
      <p className="text-gray-500 max-w-md">
        We just sent you a confirmation link. Click it to activate your partner
        referral link. It expires in 30 days.
      </p>
      <a
        href="/partners"
        className="mt-8 text-sm text-gray-400 underline"
      >
        Back to partners
      </a>
    </main>
  );
}
