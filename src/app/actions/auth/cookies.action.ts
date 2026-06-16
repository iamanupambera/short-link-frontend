'use server';

import { AuthState } from '@/core/store/features/auth/types';
import { cookies } from 'next/headers';

async function setCookies<T>(
  name: string,
  value: T,
  expires?: Date | number | undefined,
) {
  const encryptedValue = await encrypt<T>(value);
  const cookieStore = await cookies();
  return cookieStore
    .set(name, encryptedValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires,
    })
    .toString();
}

async function getCookies<T>(name: string): Promise<T | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(name)?.value;
  if (!value) return null;
  return decrypt<T>(value);
}

async function removeCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.delete(name).toString();
}

const encrypt = async <T>(value: T) => {
  return btoa(JSON.stringify(value));
};

const decrypt = async <T>(value: string) => {
  try {
    return JSON.parse(atob(value) as string) as T;
  } catch {
    await removeCookie('session');
    return null;
  }
};

const setSession = async (value: AuthState) => {
  return setCookies('session', value);
};

const getSession = async () => {
  return getCookies<AuthState>('session');
};

const destroySession = async () => {
  return removeCookie('session');
};

export {
  setCookies,
  getCookies,
  removeCookie,
  setSession,
  getSession,
  destroySession,
};
