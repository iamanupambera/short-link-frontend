import { AuthShell } from '@/components/shared/auth-shell';
import { ForgotPasswordForm } from '@/features/auth';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      description="Use your account email to receive a reset link."
      switchLabel="Remembered it?"
      switchHref="/auth/login"
      switchText="Sign in"
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
