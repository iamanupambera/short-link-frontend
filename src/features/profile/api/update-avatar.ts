import { apiRequest, unwrapData } from '@/lib/api/client';
import { apiEndpoints } from '@/lib/api/endpoints';
import { normalizeUser } from '@/features/auth/api/normalize';

export async function updateProfilePictureRequest(
  body: FormData,
  options?: { token?: string | null },
) {
  const response = await apiRequest<unknown>(
    apiEndpoints.auth.changeProfilePicture,
    {
      method: 'POST',
      body,
      token: options?.token,
    },
  );
  return normalizeUser(unwrapData(response));
}
