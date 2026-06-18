'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PartnerSignup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, consentMarketing: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      router.push('/partners/check-email');
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold">Become a Partner</h1>
        <p className="text-gray-500">Takes 30 seconds. No approval needed.</p>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input
          className="w-full border px-4 py-3 rounded-lg"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border px-4 py-3 rounded-lg"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border px-4 py-3 rounded-lg"
          placeholder="Phone (WhatsApp preferred)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:opacity-80 transition disabled:opacity-50"
        >
          {loading ? 'Sending confirmation email…' : 'Get My Referral Link'}
        </button>
      </div>
    </main>
  );
}
