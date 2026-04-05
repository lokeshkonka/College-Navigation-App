import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { subscribeToOccupancyRealtime } from '@/features/occupancy/realtime/subscribeOccupancy';
import { logger } from '@/services/logger';
import { initializeNotifications } from '@/services/notifications/expoNotifications';
import { getSupabaseClient } from '@/services/supabase/client';

export function AppProviders({ children }: PropsWithChildren) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 60_000
          }
        }
      }),
    []
  );

  useEffect(() => {
    initializeNotifications();

    const channel = subscribeToOccupancyRealtime(queryClient);
    return () => {
      getSupabaseClient().removeChannel(channel).catch(() => undefined);
    };
  }, [queryClient]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SafeAreaProvider>
  );
}

export function reportProviderError(error: unknown) {
  logger.error('Provider-level error', error);
}
