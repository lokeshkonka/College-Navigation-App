import { MOCK_RECENT } from '@/lib/constants/mockData';
import { toRelativeTime } from '@/lib/utils/time';
import { getSupabaseClient } from '@/services/supabase/client';
import type { RecentDestination } from '@/types/domain';

export async function getRecentDestinations(): Promise<RecentDestination[]> {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return MOCK_RECENT;
    }

    const { data, error } = await supabase
      .from('v_recent_destinations')
      .select('id, user_id, building_id, building_name, visited_at')
      .eq('user_id', user.id)
      .order('visited_at', { ascending: false })
      .limit(8);

    if (error) throw error;

    const rows = (data ?? []) as Array<{
      id: number;
      building_id: string;
      building_name: string;
      visited_at: string;
    }>;

    return rows.map((row) => ({
      id: String(row.id),
      building_id: row.building_id,
      building_name: row.building_name,
      visited_at: row.visited_at,
      relative_time: toRelativeTime(row.visited_at)
    }));
  } catch {
    return MOCK_RECENT;
  }
}
