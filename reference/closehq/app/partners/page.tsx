export default function PartnersPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <h1 className="text-4xl font-bold mb-4">Partner with iClose</h1>
      <p className="text-lg text-gray-500 mb-8 max-w-xl text-center">
        Refer closers and buyers to iClose.ae. Track your referrals, watch your network grow, and earn rewards when we monetize.
      </p>
      <a
        href="/partners/signup"
        className="bg-black text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-80 transition"
      >
        Join as a Partner
      </a>
    </main>
  );
}
