'use server';

import { forgotPasswordSchema } from '../schemas/forgot-password.schema';
import { forgotPasswordRequest } from '../api/forgot-password';
import { getErrorMessage } from '@/lib/api/client';
import type { FormActionState } from '../types/auth.types';
import { readFormValue } from './form-data';

export async function forgotPasswordAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: readFormValue(formData, 'email'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      errors: parsed.error.flatten().fieldErrors,
      message: 'Please enter a valid email.',
    };
  }

  try {
    return {
      status: 'success',
      message: await forgotPasswordRequest(parsed.data.email),
    };
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error),
    };
  }
}
