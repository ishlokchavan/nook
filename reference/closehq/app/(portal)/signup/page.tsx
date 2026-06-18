import type { Metadata } from 'next';
import { AuthForm } from '@/components/portal/auth-form';

export const metadata: Metadata = {
  title: 'Sign up',
  description: 'Create your iClose account to buy, sell, list and earn credits — never pay commission.',
};

export default function SignupPage() {
  return (
    <div className="bg-mist min-h-[calc(100vh-7rem)] flex items-center justify-center px-4 py-16">
      <AuthForm mode="signup" />
    </div>
  );
}
