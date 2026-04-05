import { MOCK_ROUTES } from '@/lib/constants/mockData';
import { getSupabaseClient } from '@/services/supabase/client';
import type { RouteResult } from '@/types/domain';

export async function getBestRoute(
  originId: string,
  destinationId: string,
  isAccessible = false
): Promise<RouteResult> {
  try {
    const { data, error } = await getSupabaseClient()
      .from('routes')
      .select('id, distance_m, duration_min, is_accessible, path_geojson')
      .eq('origin_building_id', originId)
      .eq('destination_building_id', destinationId)
      .eq('is_accessible', isAccessible)
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const row = data as unknown as {
        id: string;
        distance_m: number;
        duration_min: number;
        is_accessible: boolean;
      };

      return {
        id: row.id,
        distance_m: row.distance_m,
        duration_min: row.duration_min,
        is_accessible: row.is_accessible,
        steps: [
          { instruction: 'Head toward central walkway', distance_m: Math.floor(row.distance_m / 2) },
          { instruction: 'Continue to destination entrance', distance_m: Math.ceil(row.distance_m / 2) }
        ]
      };
    }
  } catch {
    // fallback route below
  }

  return (
    MOCK_ROUTES[0] ?? {
      id: 'fallback-route',
      distance_m: 0,
      duration_min: 0,
      is_accessible: false,
      steps: []
    }
  );
}
