import { AuthShell } from '@/components/shared/auth-shell';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage short links, QR codes, and click analytics."
      switchLabel="New to ShortLink?"
      switchHref="/auth/register"
      switchText="Create an account"
    >
      <LoginForm />
    </AuthShell>
  );
}
