'use client';

import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query/query-client';
import { AuthProvider } from '@/features/auth/providers/auth-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthProvider>
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
export default Providers;
