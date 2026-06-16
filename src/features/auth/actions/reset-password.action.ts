'use server';

import { resetPasswordSchema } from '../schemas/reset-password.schema';
import { resetPasswordRequest } from '../api/reset-password';
import { getErrorMessage } from '@/lib/api/client';
import type { FormActionState } from '../types/auth.types';

export async function resetPasswordAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const token = readFormValue(formData, 'token');

  const parsed = resetPasswordSchema.safeParse({
    password: readFormValue(formData, 'password'),
    confirmPassword: readFormValue(formData, 'confirmPassword'),
  });

  const errors: Record<string, string[]> = {};

  if (!token) {
    errors.token = ['Reset token is missing.'];
  }

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    Object.assign(errors, fieldErrors);
  }

  if (Object.keys(errors).length) {
    return {
      status: 'error',
      errors,
      message: 'Please check the highlighted fields.',
    };
  }

  try {
    return {
      status: 'success',
      message: await resetPasswordRequest({
        token,
        password: parsed.data!.password,
      }),
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
