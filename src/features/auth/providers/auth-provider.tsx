'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useStore } from 'zustand';
import { createAuthStore } from '../store/auth-store';
import { AuthStore } from '../store/types';
import AuthSync from './auth-sync';

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthStoreApi | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [store] = useState(() => createAuthStore());

  return (
    <AuthContext.Provider value={store}>
      <AuthSync />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthStore must be used within AuthProvider');
  }

  return useStore(context, selector);
};
