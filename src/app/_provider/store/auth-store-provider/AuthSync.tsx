'use client';

import { useEffect, useState } from 'react';
import { useAuthDispatches, useAuthState } from './sandbox';
import AuthGuard from '../../guard/AuthGuard';
import { getSession } from '@/app/actions/auth/cookies.action';

export default function AuthSync() {
  const { isAuthenticated } = useAuthState();
  const { reset } = useAuthDispatches();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const run = async () => {
      const session = await getSession();

      if (!session && isAuthenticated) {
        reset();
      }

      setSynced(true);
    };

    run();
  }, [isAuthenticated, reset]);

  if (!synced) return null;

  return <AuthGuard />;
}
