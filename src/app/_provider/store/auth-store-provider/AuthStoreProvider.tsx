'use client';

import { createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';
import { AuthStore, createAuthStore } from '@/core/store';
import {
  AuthStoreApi,
  AuthStoreProviderProps,
} from './AuthStoreProvider.types';

const AuthContext = createContext<AuthStoreApi | null>(null);

export const AuthProvider = ({ children }: AuthStoreProviderProps) => {
  const [store] = useState(() => createAuthStore());

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(`useAuthStore must be used within AuthProvider`);
  }

  return useStore(context, selector);
};
