import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 60,   // Keep unused data for 1 hour
      retry: 1,                 // Retry failed requests once
      refetchOnWindowFocus: true,
    },
  },
});