'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, SearchIcon, Loader2Icon } from 'lucide-react';
import { LinksTable, useLinks } from '@/features/links';
import type { LinkStatus } from '@/features/links';

export default function LinksPage() {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<LinkStatus | 'ALL'>('ALL');

  const { data: response, isLoading } = useLinks({
    search,
    status: status === 'ALL' ? undefined : status,
    limit: 50,
  });

  const handleFilterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    const statusValue = formData.get('status') as LinkStatus | 'ALL';

    setSearch(searchValue.trim() || undefined);
    setStatus(statusValue);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-white">
            Links
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, filter, and manage destinations.
          </p>
        </div>
        <Link
          href="/links/new"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 text-sm font-medium text-white transition-colors hover:bg-teal-500"
        >
          <PlusIcon className="size-4" />
          New link
        </Link>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        className="grid gap-3 rounded-lg border border-border bg-card p-3 md:grid-cols-[1fr_180px_auto]"
      >
        <label className="relative">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="search"
            placeholder="Search links"
            className="h-9 w-full rounded-lg border border-border bg-background pr-3 pl-8 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-950/20"
          />
        </label>
        <select
          name="status"
          defaultValue="ALL"
          className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-950/20"
        >
          <option value="ALL" className="bg-slate-900">
            All statuses
          </option>
          <option value="ACTIVE" className="bg-slate-900">
            Active
          </option>
          <option value="INACTIVE" className="bg-slate-900">
            Inactive
          </option>
          <option value="EXPIRED" className="bg-slate-900">
            Expired
          </option>
        </select>
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-medium text-slate-100 transition-colors hover:bg-slate-700"
        >
          Apply
        </button>
      </form>

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2Icon className="size-8 animate-spin text-teal-600" />
        </div>
      ) : (
        <LinksTable links={response?.links ?? []} />
      )}
    </div>
  );
}
