export const queryKeys = {
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  links: {
    all: ['links'] as const,
    list: (filters: Record<string, unknown>) => ['links', filters] as const,
    detail: (id: string | number) => ['links', id] as const,
  },
  analytics: {
    dashboard: ['analytics', 'dashboard'] as const,
    link: (id: string | number) => ['analytics', 'link', id] as const,
  },
};
