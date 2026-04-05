import type { QueryClient } from '@tanstack/react-query';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { logger } from '@/services/logger';
import { getSupabaseClient } from '@/services/supabase/client';

export function subscribeToOccupancyRealtime(queryClient: QueryClient): RealtimeChannel {
  const supabase = getSupabaseClient();

  const channel = supabase
    .channel('occupancy-live-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'occupancy_live' },
      (payload) => {
        logger.info('Realtime occupancy update received', {
          eventType: payload.eventType,
          table: payload.table
        });

        queryClient.invalidateQueries({ queryKey: ['map-points'] }).catch(() => undefined);
        queryClient.invalidateQueries({ queryKey: ['building'] }).catch(() => undefined);
        queryClient.invalidateQueries({ queryKey: ['admin-occupancy'] }).catch(() => undefined);
        queryClient.invalidateQueries({ queryKey: ['admin-kpis'] }).catch(() => undefined);
      }
    )
    .subscribe((status) => {
      logger.info('Realtime occupancy channel status', { status });
    });

  return channel;
}
