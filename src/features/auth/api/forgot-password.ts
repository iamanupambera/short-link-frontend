import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { readMessage } from './normalize';

export async function forgotPasswordRequest(email: string) {
  const response = await apiRequest<Record<string, never>>(
    apiEndpoints.auth.forgotPassword,
    {
      method: 'POST',
      body: { email },
    },
  );

  return (
    readMessage(response) ??
    'If the email exists, reset instructions were sent.'
  );
}
