'use client';

import { useRouter } from 'next/navigation';
import { LinkForm, useCreateLink } from '@/features/links';
import type { FormActionState } from '@/features/auth';
import { getErrorMessage } from '@/lib/api/client';

export default function NewLinkPage() {
  const createMutation = useCreateLink();
  const router = useRouter();

  const handleCreate = async (
    _state: FormActionState,
    formData: FormData,
  ): Promise<FormActionState> => {
    const originalUrl = formData.get('originalUrl') as string;
    const customAlias = formData.get('customAlias') as string;
    const expiresAt = formData.get('expiresAt') as string;
    const password = formData.get('password') as string;

    try {
      const link = await createMutation.mutateAsync({
        originalUrl,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        password: password || undefined,
      });

      router.push(`/links/${link.id}`);
      return { status: 'success', message: 'Short link created successfully.' };
    } catch (err) {
      return {
        status: 'error',
        message: getErrorMessage(err) || 'Failed to create short link.',
      };
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">New link</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a short URL with optional alias, expiration, and password.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <LinkForm mode="create" action={handleCreate} />
      </section>
    </div>
  );
}
