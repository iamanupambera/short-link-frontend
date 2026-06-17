'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  MousePointerClickIcon,
  UsersIcon,
  Loader2Icon,
} from 'lucide-react';
import {
  ClicksChart,
  BreakdownChart,
  useLinkAnalytics,
} from '@/features/analytics';
import type { LinkAnalytics } from '@/features/analytics';
import { useLinkDetail } from '@/features/links';
import { formatNumber, getUrlHost } from '@/lib/utils/format';

type LinkAnalyticsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const emptyAnalytics: LinkAnalytics = {
  totalClicks: 0,
  uniqueVisitors: 0,
  clicksOverTime: [],
  devices: [],
  browsers: [],
  countries: [],
  referrers: [],
};

export default function LinkAnalyticsPage({ params }: LinkAnalyticsPageProps) {
  const { id } = use(params);
  const {
    data: link,
    isLoading: isLinkLoading,
    isError: isLinkError,
  } = useLinkDetail(id);
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useLinkAnalytics(id);

  if (isLinkLoading || isAnalyticsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isLinkError || !link) {
    return (
      <div className="rounded-lg border border-red-950/30 bg-red-950/10 p-6 text-center text-red-400">
        <p className="font-medium">Link not found or failed to load.</p>
        <Link
          href="/links"
          className="mt-2 inline-block text-sm underline text-white"
        >
          Back to links
        </Link>
      </div>
    );
  }

  const activeAnalytics = analytics ?? emptyAnalytics;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/links/${link.id}`}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-white"
        >
          <ArrowLeftIcon className="size-4" />
          Back to link
        </Link>
        <h1 className="text-2xl font-semibold tracking-normal text-white">
          Analytics for /{link.shortCode}
        </h1>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {getUrlHost(link.originalUrl)}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <Metric
          label="Total clicks"
          value={formatNumber(activeAnalytics.totalClicks)}
          icon={<MousePointerClickIcon className="size-4" />}
          tone="bg-teal-950/20 text-teal-400"
        />
        <Metric
          label="Unique visitors"
          value={formatNumber(activeAnalytics.uniqueVisitors)}
          icon={<UsersIcon className="size-4" />}
          tone="bg-amber-950/20 text-amber-400"
        />
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-white">
            Clicks over time
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Daily clicks and unique visitors for this link.
          </p>
        </div>
        <ClicksChart data={activeAnalytics.clicksOverTime} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <BreakdownPanel title="Devices" data={activeAnalytics.devices} />
        <BreakdownPanel title="Browsers" data={activeAnalytics.browsers} />
        <BreakdownPanel title="Countries" data={activeAnalytics.countries} />
        <BreakdownPanel title="Referrers" data={activeAnalytics.referrers} />
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={`flex size-8 items-center justify-center rounded-lg ${tone}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
    </div>
  );
}

function BreakdownPanel({
  title,
  data,
}: {
  title: string;
  data: LinkAnalytics['devices'];
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {data.length ? (
        <BreakdownChart data={data} />
      ) : (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          No data yet.
        </p>
      )}
    </div>
  );
}
