import Link from 'next/link';
import { BarChart3Icon, ExternalLinkIcon } from 'lucide-react';
import { CopyShortLinkButton } from '@/features/links/components/copy-short-link-button';
import { StatusPill } from '@/features/links/components/status-pill';
import { formatDate } from '@/lib/utils/date';
import { formatNumber, getUrlHost, truncateMiddle } from '@/lib/utils/format';
import type { ShortLink } from '@/features/links/types/link.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

type LinksTableProps = {
  links: ShortLink[];
};

export function LinksTable({ links }: LinksTableProps) {
  if (!links.length) {
    return (
      <Empty className="min-h-72 rounded-lg border border-dashed border-slate-300 bg-white">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ExternalLinkIcon />
          </EmptyMedia>
          <EmptyTitle>No links found</EmptyTitle>
          <EmptyDescription>
            Create a short link or adjust the current filters.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Short link</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/links/${link.id}`}
                    className="font-medium text-teal-700 underline-offset-4 hover:underline"
                  >
                    /{link.shortCode}
                  </Link>
                  <CopyShortLinkButton value={link.shortUrl ?? ''} />
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[360px]">
                  <div className="truncate font-medium">
                    {getUrlHost(link.originalUrl)}
                  </div>
                  <div className="truncate text-xs text-slate-500">
                    {truncateMiddle(link.originalUrl, 64)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusPill status={link.status} />
              </TableCell>
              <TableCell>{formatNumber(link.clickCount)}</TableCell>
              <TableCell>{formatDate(link.expiresAt)}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/links/${link.id}/analytics`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    aria-label="Open analytics"
                    title="Open analytics"
                  >
                    <BarChart3Icon className="size-4" />
                  </Link>
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    aria-label="Open short link"
                    title="Open short link"
                  >
                    <ExternalLinkIcon className="size-4" />
                  </a>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
