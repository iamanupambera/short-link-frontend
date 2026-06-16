import { AuthState } from '../types/auth-store.types';

export const AUTH_STORE_KEY = 'short-link-auth-store';

export const defaultInitState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  hydrated: false,
} as const;
