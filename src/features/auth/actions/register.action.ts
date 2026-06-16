'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { registerSchema } from '../schemas/register.schema';
import { registerRequest } from '../api/register';
import { getErrorMessage } from '@/lib/api/client';
import { setSession } from '@/lib/auth/session';
import type { FormActionState } from '../types/auth.types';

export async function registerAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = registerSchema.safeParse({
    name: readFormValue(formData, 'name'),
    email: readFormValue(formData, 'email'),
    password: readFormValue(formData, 'password'),
    confirmPassword: readFormValue(formData, 'confirmPassword'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please check the highlighted fields.',
    };
  }

  try {
    const result = await registerRequest({
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (result.session) {
      await setSession(result.session);
      revalidatePath('/', 'layout');
      redirect('/dashboard');
    }

    return {
      status: 'success',
      message: result.message,
    };
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error),
    };
  }
}

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}
