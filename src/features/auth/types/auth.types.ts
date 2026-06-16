import type { User } from '@/features/profile/types/user.types';

export type FieldErrors = Record<string, string[]>;

export type FormActionState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: FieldErrors;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  expiresAt: string;
};

export type AuthResult = {
  session?: AuthSession;
  message: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = LoginInput & {
  name: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};
