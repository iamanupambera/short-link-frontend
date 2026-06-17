import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { readMessage } from './normalize';

export async function resendVerificationRequest(email: string) {
  const response = await apiRequest<Record<string, never>>(
    apiEndpoints.auth.resendVerificationMail,
    {
      method: 'POST',
      body: { email },
    },
  );

  return (
    readMessage(response) ?? 'Verification email sent if the account exists.'
  );
}
