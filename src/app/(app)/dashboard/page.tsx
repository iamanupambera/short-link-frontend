'use client';

import Link from 'next/link';
import {
  BarChart3Icon,
  LinkIcon,
  MousePointerClickIcon,
  UsersIcon,
  Loader2Icon,
} from 'lucide-react';
import { ClicksChart } from '@/features/analytics/components/clicks-chart';
import { LinksTable } from '@/features/links/components/links-table';
import { useDashboardAnalytics } from '@/features/analytics/hooks/use-analytics';
import { useLinks } from '@/features/links/hooks/use-links';
import { formatNumber } from '@/lib/utils/format';

export default function DashboardPage() {
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useDashboardAnalytics();
  const { data: linksData, isLoading: isLinksLoading } = useLinks({ limit: 6 });

  if (isAnalyticsLoading || isLinksLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const dashboardAnalytics = analytics ?? {
    totalLinks: 0,
    totalClicks: 0,
    uniqueVisitors: 0,
    activeLinks: 0,
    clicksOverTime: [],
    topLinks: [],
  };

  const recentLinks = linksData?.links ?? [];

  const metrics = [
    {
      label: 'Total links',
      value: dashboardAnalytics.totalLinks,
      icon: LinkIcon,
      tone: 'text-teal-700 bg-teal-50',
    },
    {
      label: 'Active links',
      value: dashboardAnalytics.activeLinks,
      icon: BarChart3Icon,
      tone: 'text-blue-700 bg-blue-50',
    },
    {
      label: 'Total clicks',
      value: dashboardAnalytics.totalClicks,
      icon: MousePointerClickIcon,
      tone: 'text-amber-700 bg-amber-50',
    },
    {
      label: 'Unique visitors',
      value: dashboardAnalytics.uniqueVisitors,
      icon: UsersIcon,
      tone: 'text-rose-700 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of link activity and recent destinations.
          </p>
        </div>
        <Link
          href="/links/new"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-teal-600 px-3 text-sm font-medium text-white transition-colors hover:bg-teal-700"
        >
          Create short link
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-500">
                {metric.label}
              </span>
              <span
                className={`flex size-8 items-center justify-center rounded-lg ${metric.tone}`}
              >
                <metric.icon className="size-4" />
              </span>
            </div>
            <div className="mt-4 text-3xl font-semibold">
              {formatNumber(metric.value)}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Clicks over time</h2>
            <p className="mt-1 text-sm text-slate-500">
              Daily activity across your short links.
            </p>
          </div>
          <ClicksChart data={dashboardAnalytics.clicksOverTime} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold">Top links</h2>
            <p className="mt-1 text-sm text-slate-500">
              Destinations with the most clicks.
            </p>
          </div>
          <div className="space-y-3">
            {dashboardAnalytics.topLinks.length ? (
              dashboardAnalytics.topLinks.map((link) => (
                <Link
                  key={link.id}
                  href={`/links/${link.id}/analytics`}
                  className="block rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium">
                      /{link.shortCode}
                    </span>
                    <span className="text-sm text-slate-500">
                      {formatNumber(link.clicks)}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-slate-500">
                    {link.originalUrl}
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                No click data yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Recent links</h2>
          <Link
            href="/links"
            className="text-sm font-medium text-teal-700 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <LinksTable links={recentLinks} />
      </section>
    </div>
  );
}
