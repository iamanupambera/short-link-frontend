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
import {
  LinkForm,
  StatusPill,
  CopyShortLinkButton,
  useLinkDetail,
  useUpdateLink,
  useDeleteLink,
  useQrCode,
} from '@/features/links';
import type { LinkStatus } from '@/features/links';
import { getApiBaseUrl, getErrorMessage } from '@/lib/api/client';
import { formatDate } from '@/lib/utils/date';
import { formatNumber, getUrlHost } from '@/lib/utils/format';
import type { FormActionState } from '@/features/auth';

type LinkDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function LinkDetailPage({ params }: LinkDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: link, isLoading, isError } = useLinkDetail(id);
  const {
    data: qrDataUrl,
    isLoading: isQrLoading,
    isError: isQrError,
  } = useQrCode(id);
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
              <span className="inline-flex h-6 items-center rounded-full border border-blue-950/30 bg-blue-950/10 px-2 text-xs font-medium text-blue-400">
                protected
              </span>
            ) : null}
          </div>
          <h1 className="truncate text-2xl font-semibold tracking-normal text-white">
            /{link.shortCode}
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {getUrlHost(link.originalUrl)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyShortLinkButton value={link.shortUrl ?? ''} />
          <Link
            href={`/links/${link.id}/analytics`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <BarChart3Icon className="size-4" />
            Analytics
          </Link>
          <a
            href={link.shortUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-teal-600 px-3 text-sm font-medium text-white transition-colors hover:bg-teal-500"
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
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">
              Link settings
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update destination, alias, expiration, password, or status.
            </p>
          </div>
          <LinkForm mode="edit" action={handleUpdate} link={link} />
        </section>

        <aside className="space-y-4">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-base font-semibold text-white">QR code</h2>
            <div className="mt-4 flex aspect-square items-center justify-center rounded-lg border border-border bg-slate-950/30 overflow-hidden relative">
              {isQrLoading ? (
                <Loader2Icon className="size-6 animate-spin text-teal-600" />
              ) : isQrError || !qrDataUrl ? (
                <div className="text-center text-xs text-red-500 px-4">
                  Failed to load QR code.
                </div>
              ) : (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${link.shortCode}`}
                  className="size-full object-contain p-2"
                />
              )}
            </div>
            <a
              href={qrDownloadUrl}
              className="mt-4 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium transition-colors hover:bg-accent text-muted-foreground hover:text-foreground"
            >
              <DownloadIcon className="size-4" />
              Download PNG
            </a>
          </section>

          <section className="rounded-lg border border-red-950/30 bg-red-950/5 p-5">
            <h2 className="text-base font-semibold text-red-400">
              Delete link
            </h2>
            <p className="mt-1 text-sm text-red-400/80">
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
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 truncate text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}
