'use client';

import { useEffect, useState } from 'react';
import { useAuthDispatches, useAuthState } from '../store/use-auth';
import AuthGuard from '../guards/auth-guard';
import { getSession } from '@/lib/auth/cookies';
import type { AuthSession } from '../types/auth.types';

const TOKEN_REFRESHED_EVENT = 'shortlink:token-refreshed';

export default function AuthSync() {
  const { isAuthenticated } = useAuthState();
  const { login, reset } = useAuthDispatches();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const run = async () => {
      const session = await getSession();

      if (session) {
        if (!isAuthenticated) {
          login({ user: session.user, accessToken: session.accessToken });
        }
      } else {
        if (isAuthenticated) {
          reset();
        }
      }

      setSynced(true);
    };

    run();
  }, [isAuthenticated, login, reset]);

  useEffect(() => {
    function handleTokenRefreshed(event: Event) {
      const session = (event as CustomEvent<Omit<AuthSession, 'expiresAt'>>).detail;

      if (session?.user && session.accessToken) {
        login({ user: session.user, accessToken: session.accessToken });
      }
    }

    window.addEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefreshed);

    return () => {
      window.removeEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefreshed);
    };
  }, [login]);

  if (!synced) return null;

  return <AuthGuard />;
}
