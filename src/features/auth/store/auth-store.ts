import { createStore } from 'zustand/vanilla';
import { devtools, persist } from 'zustand/middleware';
import { AuthStore } from '../types/auth-store.types';
import { AUTH_STORE_KEY, defaultInitState } from './constants';

export const createAuthStore = () =>
  createStore<AuthStore>()(
    persist(
      devtools((set) => ({
        ...defaultInitState,
        login: ({ user, accessToken }) => {
          if (user && accessToken) {
            return set(() => ({
              user,
              accessToken,
              isAuthenticated: true,
            }));
          }
        },
        logout: () =>
          set(() => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          })),
        updateProfile: (updatedUser) =>
          set((state) => ({
            ...state,
            user: state.user ? { ...state.user, ...updatedUser } : null,
          })),
        setHydrated: () => set({ hydrated: true }),
        reset: () => set(defaultInitState),
      })),
      {
        name: AUTH_STORE_KEY,
        partialize: (state) => ({ hydrated: state.hydrated }),
        onRehydrateStorage: () => (state) => {
          state?.setHydrated();
        },
      },
    ),
  );
