'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3Icon,
  DownloadIcon,
  ExternalLinkIcon,
  Trash2Icon,
  Loader2Icon,
} from 'lucide-react';
import { LinkForm } from '@/features/links/components/link-form';
import { StatusPill } from '@/features/links/components/status-pill';
import { CopyShortLinkButton } from '@/features/links/components/copy-short-link-button';
import { getApiBaseUrl, getErrorMessage } from '@/lib/api/client';
import {
  useLinkDetail,
  useUpdateLink,
  useDeleteLink,
} from '@/features/links/hooks/use-links';
import { formatDate } from '@/lib/utils/date';
import { formatNumber, getUrlHost } from '@/lib/utils/format';
import type { FormActionState } from '@/features/auth/types/auth.types';
import type { LinkStatus } from '@/features/links/types/link.types';

type LinkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function LinkDetailPage({ params }: LinkDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: link, isLoading, isError } = useLinkDetail(id);
  const updateMutation = useUpdateLink(id);
  const deleteMutation = useDeleteLink();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError || !link) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <p className="font-medium">Link not found or failed to load.</p>
        <Link href="/links" className="mt-2 inline-block text-sm underline">
          Back to links
        </Link>
      </div>
    );
  }

  const qrDownloadUrl = `${getApiBaseUrl()}/links/${link.id}/qrcode?download=true`;

  const handleUpdate = async (
    _state: FormActionState,
    formData: FormData,
  ): Promise<FormActionState> => {
    const originalUrl = formData.get('originalUrl') as string;
    const customAlias = formData.get('customAlias') as string;
    const expiresAt = formData.get('expiresAt') as string;
    const password = formData.get('password') as string;
    const status = formData.get('status') as Exclude<LinkStatus, 'EXPIRED'>;

    try {
      await updateMutation.mutateAsync({
        originalUrl,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        password: password || undefined,
        status,
      });
      return { status: 'success', message: 'Link updated.' };
    } catch (err) {
      return {
        status: 'error',
        message: getErrorMessage(err),
      };
    }
  };

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        await deleteMutation.mutateAsync(link.id);
        router.push('/links');
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusPill status={link.status} />
            {link.isPasswordProtected ? (
              <span className="inline-flex h-6 items-center rounded-full border border-blue-200 bg-blue-50 px-2 text-xs font-medium text-blue-700">
                protected
              </span>
            ) : null}
          </div>
          <h1 className="truncate text-2xl font-semibold tracking-normal">
            /{link.shortCode}
          </h1>
          <p className="mt-1 truncate text-sm text-slate-500">
            {getUrlHost(link.originalUrl)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyShortLinkButton value={link.shortUrl ?? ''} />
          <Link
            href={`/links/${link.id}/analytics`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <BarChart3Icon className="size-4" />
            Analytics
          </Link>
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            <ExternalLinkIcon className="size-4" />
            Open
          </a>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric label="Clicks" value={formatNumber(link.clickCount)} />
        <Metric
          label="Unique visitors"
          value={formatNumber(link.uniqueVisitors ?? 0)}
        />
        <Metric label="Created" value={formatDate(link.createdAt)} />
        <Metric label="Expires" value={formatDate(link.expiresAt)} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold">Link settings</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update destination, alias, expiration, password, or status.
            </p>
          </div>
          <LinkForm mode="edit" action={handleUpdate} link={link} />
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold">QR code</h2>
            <div className="mt-4 flex aspect-square items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
              <div className="text-center text-sm text-slate-500">
                QR preview
              </div>
            </div>
            <a
              href={qrDownloadUrl}
              className="mt-4 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-sm font-medium transition-colors hover:bg-slate-50"
            >
              <DownloadIcon className="size-4" />
              Download PNG
            </a>
          </section>

          <section className="rounded-lg border border-red-200 bg-red-50 p-5">
            <h2 className="text-base font-semibold text-red-950">
              Delete link
            </h2>
            <p className="mt-1 text-sm text-red-700">
              Delete this short URL and its dashboard listing.
            </p>
            <form onSubmit={handleDelete} className="mt-4">
              <button
                type="submit"
                disabled={deleteMutation.isPending}
                className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2Icon className="size-4" />
                {deleteMutation.isPending ? 'Deleting...' : 'Delete link'}
              </button>
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 truncate text-lg font-semibold">{value}</div>
    </div>
  );
}
