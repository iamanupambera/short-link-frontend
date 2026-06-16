'use client';

import { useEffect, useState } from 'react';
import { useAuthDispatches, useAuthState } from '../store/use-auth';
import AuthGuard from '../guards/auth-guard';
import { getSession } from '@/lib/auth/cookies';

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

  if (!synced) return null;

  return <AuthGuard />;
}
