import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { readMessage } from './normalize';
import type { ResetPasswordInput } from '../types/auth.types';

export async function resetPasswordRequest(input: ResetPasswordInput) {
  const response = await apiRequest<unknown>(apiEndpoints.auth.resetPassword, {
    method: 'POST',
    body: input,
  });

  return readMessage(response) ?? 'Password reset successfully.';
}
