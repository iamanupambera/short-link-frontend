import { AuthLayout } from '@/components/layouts/auth-layout';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      description="Use your account email to receive a reset link."
      switchLabel="Remembered it?"
      switchHref="/auth/login"
      switchText="Sign in"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
