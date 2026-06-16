'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type {
  BreakdownPoint,
  TimeSeriesPoint,
} from '@/features/analytics/types/analytics.types';

const clicksConfig = {
  clicks: {
    label: 'Clicks',
    color: '#0d9488',
  },
  uniqueVisitors: {
    label: 'Unique visitors',
    color: '#f59e0b',
  },
} satisfies ChartConfig;

const breakdownConfig = {
  value: {
    label: 'Clicks',
    color: '#2563eb',
  },
} satisfies ChartConfig;

type ClicksChartProps = {
  data: TimeSeriesPoint[];
};

export function ClicksChart({ data }: ClicksChartProps) {
  return (
    <ChartContainer config={clicksConfig} className="h-72 w-full">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="clicks-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="clicks"
          type="monotone"
          stroke="#0d9488"
          fill="url(#clicks-fill)"
          strokeWidth={2}
        />
        <Area
          dataKey="uniqueVisitors"
          type="monotone"
          stroke="#f59e0b"
          fill="transparent"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}

type BreakdownChartProps = {
  data: BreakdownPoint[];
};

export function BreakdownChart({ data }: BreakdownChartProps) {
  return (
    <ChartContainer config={breakdownConfig} className="h-56 w-full">
      <BarChart data={data} layout="vertical" margin={{ left: 12 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={96}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" fill="#2563eb" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
