'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { loginSchema } from '../schemas/login.schema';
import { loginRequest } from '../api/login';
import { getErrorMessage } from '@/lib/api/client';
import { setSession } from '@/lib/auth/session';
import type { FormActionState } from '../types/auth.types';

export async function loginAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = loginSchema.safeParse({
    email: readFormValue(formData, 'email'),
    password: readFormValue(formData, 'password'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please check the highlighted fields.',
    };
  }

  let session;

  try {
    session = await loginRequest(parsed.data);
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error),
    };
  }

  await setSession(session);
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}
