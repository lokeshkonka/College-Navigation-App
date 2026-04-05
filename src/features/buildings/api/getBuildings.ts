import { MOCK_BUILDINGS } from '@/lib/constants/mockData';
import { getSupabaseClient } from '@/services/supabase/client';
import type { Building } from '@/types/domain';

function mapBuilding(row: {
  id: string;
  name: string;
  code: string;
  description: string | null;
  latitude: number;
  longitude: number;
  tags: string[] | null;
  is_active: boolean;
}): Building {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description ?? '',
    latitude: row.latitude,
    longitude: row.longitude,
    tags: row.tags ?? [],
    is_active: row.is_active
  };
}

export async function getBuildings(search = '', tag?: string): Promise<Building[]> {
  try {
    let query = getSupabaseClient()
      .from('buildings')
      .select('id, name, code, description, latitude, longitude, tags, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true });

    const term = search.trim();
    if (term.length > 0) {
      query = query.or(`name.ilike.%${term}%,code.ilike.%${term}%`);
    }

    if (tag && tag.trim().length > 0) {
      query = query.contains('tags', [tag.trim()]);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapBuilding);
  } catch {
    const base = MOCK_BUILDINGS.filter((building) => building.is_active);
    const bySearch = search.trim().length
      ? base.filter(
          (building) =>
            building.name.toLowerCase().includes(search.toLowerCase()) ||
            building.code.toLowerCase().includes(search.toLowerCase())
        )
      : base;

    if (!tag || tag.trim().length === 0) {
      return bySearch;
    }

    return bySearch.filter((building) => building.tags.includes(tag.trim().toLowerCase()));
  }
}
