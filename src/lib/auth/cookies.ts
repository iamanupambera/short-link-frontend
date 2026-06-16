'use server';

import {
  getSession as getSecureSession,
  destroySession as destroySecureSession,
} from '@/lib/auth/session';

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
