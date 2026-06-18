import type { Metadata } from 'next';
import { AuthForm } from '@/components/portal/auth-form';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to your iClose account to manage listings, credits and enquiries.',
};

export default function LoginPage() {
  return (
    <div className="bg-mist min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-16">
      <AuthForm mode="login" />
    </div>
  );
}
