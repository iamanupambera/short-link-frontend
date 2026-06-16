export const analyticsQueryKeys = {
  dashboard: ['analytics', 'dashboard'] as const,
  link: (id: string | number) => ['analytics', 'link', id] as const,
};
