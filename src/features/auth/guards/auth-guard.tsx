'use client';

import { useCallback, useEffect } from 'react';
import { useAuthState } from '../store/use-auth';
import { usePathname, useRouter } from 'next/navigation';

const AuthGuard = () => {
  const { isAuthenticated, hydrated } = useAuthState();
  const location = usePathname();
  const { push } = useRouter();

  const redirect = useCallback(
    (path: string, isAuth: boolean) => {
      const isAuthPage = path.includes('auth');

      if (isAuthPage && isAuth) {
        push('/');
      }

      if (!isAuthPage && !isAuth) {
        push('/auth/login');
      }
    },
    [push],
  );

  useEffect(() => {
    if (hydrated) {
      redirect(location, isAuthenticated);
    }
  }, [isAuthenticated, hydrated, redirect, location]);

  return null;
};

export default AuthGuard;
