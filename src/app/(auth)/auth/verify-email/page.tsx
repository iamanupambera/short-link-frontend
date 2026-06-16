import { AuthShell } from '@/components/shared/auth-shell';
import { VerifyEmailForm } from '@/features/auth';

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify email"
      description="Request a fresh verification email for your account."
      switchLabel="Already verified?"
      switchHref="/auth/login"
      switchText="Sign in"
    >
      <VerifyEmailForm />
    </AuthShell>
  );
}
