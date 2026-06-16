import { AuthLayout } from '@/components/layouts/auth-layout';
import { LoginForm } from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage short links, QR codes, and click analytics."
      switchLabel="New to ShortLink?"
      switchHref="/auth/register"
      switchText="Create an account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
