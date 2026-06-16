'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logoutRequest } from '../api/logout';
import { destroySession, getSession } from '@/lib/auth/session';

export async function logoutAction() {
  const session = await getSession();
  await logoutRequest({ token: session?.accessToken });
  await destroySession();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
}
