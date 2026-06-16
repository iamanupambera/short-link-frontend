import { AuthLayout } from '@/components/layouts/auth-layout';
import { RegisterForm } from '@/features/auth/components/register-form';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create account"
      description="Start with a secure workspace for managed short URLs."
      switchLabel="Already have an account?"
      switchHref="/auth/login"
      switchText="Sign in"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
