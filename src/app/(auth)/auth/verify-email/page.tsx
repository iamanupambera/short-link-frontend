import { AuthLayout } from '@/components/layouts/auth-layout';
import { VerifyEmailForm } from '@/features/auth/components/verify-email-form';

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verify email"
      description="Request a fresh verification email for your account."
      switchLabel="Already verified?"
      switchHref="/auth/login"
      switchText="Sign in"
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
}
