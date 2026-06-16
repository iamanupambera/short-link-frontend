export const linksQueryKeys = {
  all: ['links'] as const,
  list: (filters: Record<string, unknown>) => ['links', filters] as const,
  detail: (id: string | number) => ['links', id] as const,
};
