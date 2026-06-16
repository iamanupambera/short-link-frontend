// Hooks
export { useLogin } from './hooks/use-login';
export { useRegister } from './hooks/use-register';
export { useCurrentUser } from './hooks/use-current-user';
export { useAuthState, useAuthDispatches } from './store/use-auth';

// Components
export { LoginForm } from './components/login-form';
export { RegisterForm } from './components/register-form';
export { ForgotPasswordForm } from './components/forgot-password-form';
export { ResetPasswordForm } from './components/reset-password-form';
export { VerifyEmailForm } from './components/verify-email-form';
export { FormMessage } from './components/form-message';
export { PasswordInput } from './components/password-input';

// Actions
export { loginAction } from './actions/login.action';
export { registerAction } from './actions/register.action';
export { logoutAction } from './actions/logout.action';
export { forgotPasswordAction } from './actions/forgot-password.action';
export { resetPasswordAction } from './actions/reset-password.action';
export { resendVerificationAction } from './actions/resend-verification.action';

// Providers & Guards
export { AuthProvider, useAuthStore } from './providers/auth-provider';
export { default as AuthGuard } from './guards/auth-guard';

// Types
export type {
  FieldErrors,
  FormActionState,
  AuthSession,
  AuthResult,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from './types/auth.types';
export type {
  AuthStore,
  AuthState,
  AuthActions,
} from './types/auth-store.types';
export { normalizeUser } from './api/normalize';
