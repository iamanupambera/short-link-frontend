import type { LinkStatus } from '@/features/links/types/link.types';
import { cn } from '@/lib/utils/cn';

type StatusPillProps = {
  status: LinkStatus;
};

const statusClassName: Record<LinkStatus, string> = {
  ACTIVE: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  INACTIVE: 'border-slate-200 bg-slate-100 text-slate-600',
  EXPIRED: 'border-amber-200 bg-amber-50 text-amber-800',
};

export function StatusPill({ status }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center rounded-full border px-2 text-xs font-medium',
        statusClassName[status],
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}
