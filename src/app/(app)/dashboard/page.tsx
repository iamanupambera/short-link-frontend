'use client';

import Link from 'next/link';
import {
  BarChart3Icon,
  LinkIcon,
  MousePointerClickIcon,
  UsersIcon,
  Loader2Icon,
} from 'lucide-react';
import { ClicksChart, useDashboardAnalytics } from '@/features/analytics';
import { LinksTable, useLinks } from '@/features/links';
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
      tone: 'text-teal-400 bg-teal-950/20',
    },
    {
      label: 'Active links',
      value: dashboardAnalytics.activeLinks,
      icon: BarChart3Icon,
      tone: 'text-blue-400 bg-blue-950/20',
    },
    {
      label: 'Total clicks',
      value: dashboardAnalytics.totalClicks,
      icon: MousePointerClickIcon,
      tone: 'text-amber-400 bg-amber-950/20',
    },
    {
      label: 'Unique visitors',
      value: dashboardAnalytics.uniqueVisitors,
      icon: UsersIcon,
      tone: 'text-rose-400 bg-rose-950/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of link activity and recent destinations.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </span>
              <span
                className={`flex size-8 items-center justify-center rounded-lg ${metric.tone}`}
              >
                <metric.icon className="size-4" />
              </span>
            </div>
            <div className="mt-4 text-3xl font-semibold text-white">
              {formatNumber(metric.value)}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">
              Clicks over time
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Daily activity across your short links.
            </p>
          </div>
          <ClicksChart data={dashboardAnalytics.clicksOverTime} />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-white">Top links</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Destinations with the most clicks.
            </p>
          </div>
          <div className="space-y-3">
            {dashboardAnalytics.topLinks.length ? (
              dashboardAnalytics.topLinks.map((link, index) => (
                <Link
                  key={`${link.id}-${link.shortCode}-${index}`}
                  href={`/links/${link.id}/analytics`}
                  className="block rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-foreground">
                      /{link.shortCode}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(link.clicks)}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {link.originalUrl}
                  </div>
                </Link>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                No click data yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">Recent links</h2>
          <Link
            href="/links"
            className="text-sm font-medium text-teal-400 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <LinksTable links={recentLinks} />
      </section>
    </div>
  );
}
