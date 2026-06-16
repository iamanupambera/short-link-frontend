import { apiRequest } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeAuthSession, readMessage } from './normalize';
import type { RegisterInput, AuthResult } from '../types/auth.types';

export async function registerRequest(
  input: RegisterInput,
): Promise<AuthResult> {
  const response = await apiRequest<unknown>(apiEndpoints.auth.register, {
    method: 'POST',
    body: input,
  });

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
