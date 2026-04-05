import { getMockBuildingDetails } from '@/lib/constants/mockData';
import { getSupabaseClient } from '@/services/supabase/client';
import type { BuildingDetails } from '@/types/domain';

export async function getBuildingById(id: string): Promise<BuildingDetails | null> {
  try {
    const { data, error } = await getSupabaseClient()
      .from('v_building_details')
      .select('id, name, code, description, latitude, longitude, tags, is_active, hours_json, occupancy_percent')
      .eq('id', id)
      .single();

    if (error) throw error;

    const row = data as unknown as {
      id: string;
      name: string;
      code: string;
      description: string | null;
      latitude: number;
      longitude: number;
      tags: string[];
      is_active: boolean;
      hours_json: unknown;
      occupancy_percent: number;
    };

    return {
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description ?? '',
      latitude: row.latitude,
      longitude: row.longitude,
      tags: row.tags,
      is_active: row.is_active,
      hours_json: (row.hours_json as Record<string, string> | null) ?? null,
      occupancy_percent: row.occupancy_percent
    };
  } catch {
    return getMockBuildingDetails(id) ?? null;
  }
}
