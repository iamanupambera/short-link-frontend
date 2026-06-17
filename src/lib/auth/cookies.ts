'use server';

import {
  getSession as getSecureSession,
  destroySession as destroySecureSession,
  setSession as setSecureSession,
} from '@/lib/auth/session';
import type { AuthSession } from '@/features/auth/types/auth.types';

export async function getSession() {
  const session = await getSecureSession();
  if (!session) return null;
  return {
    user: session.user,
    accessToken: session.accessToken,
    isAuthenticated: true,
    hydrated: true,
  };
}

export async function destroySession() {
  await destroySecureSession();
}

export async function setSession(session: Omit<AuthSession, 'expiresAt'>) {
  await setSecureSession(session);
}
