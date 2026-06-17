import { AuthShell } from '@/components/shared/auth-shell';
import { ResetPasswordForm } from '@/features/auth';

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { email = '' } = await searchParams;

  return (
    <AuthShell
      title="New password"
      description="Choose a strong password for your ShortLink account."
      switchLabel="Go back to"
      switchHref="/auth/login"
      switchText="sign in"
    >
      <ResetPasswordForm defaultEmail={email} />
    </AuthShell>
  );
}
