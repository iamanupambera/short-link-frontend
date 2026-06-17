import { getApiBaseUrl } from '@/lib/api/client';

export async function getQrCodeRequest(
  id: string | number,
  options?: { token?: string | null },
): Promise<Blob> {
  const baseUrl = getApiBaseUrl();
  const headers = new Headers();

  if (options?.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${baseUrl}/links/${id}/qrcode`, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch QR code image.');
  }

  return response.blob();
}
