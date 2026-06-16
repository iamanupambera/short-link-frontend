import { createAuthStore } from '@/core/store';
import { type ReactNode } from 'react';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export type AuthStoreProviderProps = {
  children: ReactNode;
};

export type AuthGuardProps = AuthStoreProviderProps;
