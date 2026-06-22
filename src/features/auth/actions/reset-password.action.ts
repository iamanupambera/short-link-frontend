'use server';

import { resetPasswordSchema } from '../schemas/reset-password.schema';
import { resetPasswordRequest } from '../api/reset-password';
import { getErrorMessage } from '@/lib/api/client';
import type { FormActionState } from '../types/auth.types';
import { readFormValue } from './form-data';

export async function resetPasswordAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = resetPasswordSchema.safeParse({
    email: readFormValue(formData, 'email'),
    otp: readFormValue(formData, 'otp'),
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
    return {
      status: 'success',
      message: await resetPasswordRequest({
        email: parsed.data.email,
        otp: parsed.data.otp,
        password: parsed.data.password,
      }),
    };
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error),
    };
  }
}
