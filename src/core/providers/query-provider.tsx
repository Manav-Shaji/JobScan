/**
 * ------------------------------------------------------------
 * Component: QueryProvider
 * 
 * Purpose:
 * Initializes and provides the React Query client to the application tree.
 * 
 * Responsibilities:
 * • Configure default stale times and retry logic for queries
 * • Wrap the application with QueryClientProvider
 * • Enable React Query Devtools (disabled by default)
 * 
 * Used By:
 * • Root Layout
 * ------------------------------------------------------------
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
