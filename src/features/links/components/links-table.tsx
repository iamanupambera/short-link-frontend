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
      <Empty className="min-h-72 rounded-lg border border-dashed border-border bg-card">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ExternalLinkIcon />
          </EmptyMedia>
          <EmptyTitle className="text-white">No links found</EmptyTitle>
          <EmptyDescription className="text-muted-foreground">
            Create a short link or adjust the current filters.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-border">
            <TableHead className="text-muted-foreground font-semibold">
              Short link
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold">
              Destination
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold">
              Clicks
            </TableHead>
            <TableHead className="text-muted-foreground font-semibold">
              Expires
            </TableHead>
            <TableHead className="text-right text-muted-foreground font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link, index) => (
            <TableRow
              key={`${link.id}-${link.shortCode}-${index}`}
              className="border-border hover:bg-muted/20"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/links/${link.id}`}
                    className="font-medium text-teal-400 underline-offset-4 hover:underline"
                  >
                    /{link.shortCode}
                  </Link>
                  <CopyShortLinkButton value={link.shortUrl ?? ''} />
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-[360px]">
                  <div className="truncate font-medium text-foreground">
                    {getUrlHost(link.originalUrl)}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {truncateMiddle(link.originalUrl, 64)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusPill status={link.status} />
              </TableCell>
              <TableCell className="text-foreground">
                {formatNumber(link.clickCount)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(link.expiresAt)}
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/links/${link.id}/analytics`}
                    className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    aria-label="Open analytics"
                    title="Open analytics"
                  >
                    <BarChart3Icon className="size-4" />
                  </Link>
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
