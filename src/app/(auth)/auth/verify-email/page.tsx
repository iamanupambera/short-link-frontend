import { AuthShell } from '@/components/shared/auth-shell';
import { VerifyEmailForm } from '@/features/auth';

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
    registered?: string;
    unverified?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { email = '', registered = '', unverified = '' } = await searchParams;

  return (
    <AuthShell
      title="Verify email"
      description="Enter the 6-digit verification code sent to your email."
      switchLabel="Already verified?"
      switchHref="/auth/login"
      switchText="Sign in"
    >
      <VerifyEmailForm
        defaultEmail={email}
        isRegistered={registered === 'true'}
        isUnverified={unverified === 'true'}
      />
    </AuthShell>
  );
}
