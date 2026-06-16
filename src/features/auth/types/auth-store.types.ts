import { User } from '@/features/profile/types/user.types';

export type AuthStore = AuthState & AuthActions;

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
};

export type AuthActions = {
  login: (data: { user: User; accessToken: string }) => void;
  logout: () => void;
  updateProfile: (user: Partial<User>) => void;
  setHydrated: () => void;
  reset: () => void;
};
