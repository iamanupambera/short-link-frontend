import { apiRequest } from '@/lib/api/client';
import { normalizeAuthSession, readMessage } from './normalize';
import type { AuthResult } from '../types/auth.types';
import type { User } from '@/features/profile/types/user.types';

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  user: User;
}

export async function verifyOtpRequest(
  input: VerifyOtpInput,
): Promise<AuthResult> {
  const response = await apiRequest<VerifyOtpResponse>('/auth/verify-mail', {
    method: 'POST',
    body: {
      email: input.email,
      otp: input.otp,
    },
  });

  try {
    return {
      session: normalizeAuthSession(response),
      message: 'Email verified successfully.',
    };
  } catch {
    return {
      message: readMessage(response) ?? 'Email verified successfully.',
    };
  }
}
