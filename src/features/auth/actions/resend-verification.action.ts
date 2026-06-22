'use server';

import { verifyEmailSchema } from '../schemas/verify-email.schema';
import { resendVerificationRequest } from '../api/resend-verification';
import { getErrorMessage } from '@/lib/api/client';
import type { FormActionState } from '../types/auth.types';
import { readFormValue } from './form-data';

export async function resendVerificationAction(
  _state: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = verifyEmailSchema.safeParse({
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
      message: await resendVerificationRequest(parsed.data.email),
    };
  } catch (error) {
    return {
      status: 'error',
      message: getErrorMessage(error),
    };
  }
}
