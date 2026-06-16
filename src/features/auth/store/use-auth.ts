'use client';

import { useAuthStore } from '../providers/auth-provider';

export function useAuthState() {
  const { isAuthenticated, user, accessToken, hydrated } = useAuthStore(
    (state) => state,
  );

  return {
    isAuthenticated,
    user,
    accessToken,
    hydrated,
  };
}

export function useAuthDispatches() {
  const { logout, login, updateProfile, reset } = useAuthStore(
    (state) => state,
  );

  return {
    logout,
    login,
    updateProfile,
    reset,
  };
}
