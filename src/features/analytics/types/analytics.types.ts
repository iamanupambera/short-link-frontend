export type TimeSeriesPoint = {
  date: string;
  clicks: number;
  uniqueVisitors?: number;
};

export type BreakdownPoint = {
  name: string;
  value: number;
};

export type DashboardAnalytics = {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  activeLinks: number;
  clicksOverTime: TimeSeriesPoint[];
  topLinks: {
    id: number;
    shortCode: string;
    originalUrl: string;
    clicks: number;
  }[];
};

export type LinkAnalytics = {
  totalClicks: number;
  uniqueVisitors: number;
  clicksOverTime: TimeSeriesPoint[];
  devices: BreakdownPoint[];
  browsers: BreakdownPoint[];
  countries: BreakdownPoint[];
  referrers: BreakdownPoint[];
};

export interface ApiDashboardAnalytics {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  activeLinks?: number;
  clicksOverTime: TimeSeriesPoint[];
  topLinks: {
    id: number;
    shortCode: string;
    originalUrl: string;
    clicks: number;
  }[];
}

export interface ApiLinkAnalytics {
  totalClicks: number;
  uniqueVisitors: number;
  clicksOverTime: TimeSeriesPoint[];
  devices: BreakdownPoint[];
  browsers: BreakdownPoint[];
  countries: BreakdownPoint[];
  referrers: BreakdownPoint[];
}
