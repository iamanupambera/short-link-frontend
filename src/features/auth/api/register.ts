import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeAuthSession, readMessage } from './normalize';
import type { RegisterInput, AuthResult } from '../types/auth.types';
import type { User } from '@/features/profile/types/user.types';

export type RegisterResponse = User;

export async function registerRequest(
  input: RegisterInput,
): Promise<AuthResult> {
  const response = await apiRequest<RegisterResponse>(
    apiEndpoints.auth.register,
    {
      method: 'POST',
      body: input,
    },
  );

  try {
    return {
      session: normalizeAuthSession(response),
      message: 'Account created successfully.',
    };
  } catch {
    return {
      message:
        readMessage(response) ?? 'Account created. Please verify your email.',
    };
  }
}
