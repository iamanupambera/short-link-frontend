import { AuthShell } from '@/components/shared/auth-shell';
import { RegisterForm } from '@/features/auth';

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create account"
      description="Start with a secure workspace for managed short URLs."
      switchLabel="Already have an account?"
      switchHref="/auth/login"
      switchText="Sign in"
    >
      <RegisterForm />
    </AuthShell>
  );
}
