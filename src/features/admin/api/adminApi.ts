import { getSupabaseClient } from '@/services/supabase/client';
import { getProfile } from '@/features/profile/api/profileApi';
import { isAdminRole } from '@/lib/auth';

export type AdminKpis = {
  totalUsers: number;
  openFeedback: number;
  activeBuildings: number;
  avgOccupancy: number;
};

export type AdminBuilding = {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
};

export type AdminOccupancyRow = {
  building_id: string;
  building_name: string;
  occupancy_percent: number;
  updated_at: string;
};

export type AdminFeedbackRow = {
  id: string;
  category: 'general' | 'report_error' | 'suggestion';
  sentiment: number;
  message: string;
  status: 'open' | 'triaged' | 'resolved' | 'rejected';
  created_at: string;
  building_id: string | null;
};

async function assertAdminRole() {
  const profile = await getProfile();
  if (!isAdminRole(profile.role)) {
    throw new Error('Admin access required.');
  }
  return profile;
}

export async function getAdminKpis(): Promise<AdminKpis> {
  await assertAdminRole();
  const supabase = getSupabaseClient();

  const [{ count: totalUsers }, { count: openFeedback }, { count: activeBuildings }, occupancyResponse] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('feedback').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('buildings').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('occupancy_live').select('occupancy_percent')
    ]);

  const occupancyValues = (occupancyResponse.data ?? []) as Array<{ occupancy_percent: number }>;
  const totalOcc = occupancyValues.reduce((acc, row) => acc + row.occupancy_percent, 0);
  const avgOccupancy = occupancyValues.length > 0 ? Math.round(totalOcc / occupancyValues.length) : 0;

  return {
    totalUsers: totalUsers ?? 0,
    openFeedback: openFeedback ?? 0,
    activeBuildings: activeBuildings ?? 0,
    avgOccupancy
  };
}

export async function listAdminBuildings(): Promise<AdminBuilding[]> {
  await assertAdminRole();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('buildings')
    .select('id, name, code, is_active')
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as AdminBuilding[];
}

export async function updateAdminBuilding(
  id: string,
  patch: Partial<Pick<AdminBuilding, 'name' | 'code' | 'is_active'>>
): Promise<void> {
  await assertAdminRole();
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('buildings').update(patch as never).eq('id', id);
  if (error) throw error;
}

export async function listAdminOccupancy(): Promise<AdminOccupancyRow[]> {
  await assertAdminRole();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('occupancy_live')
    .select('building_id, occupancy_percent, updated_at')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const occupancyRows = (data ?? []) as Array<{
    building_id: string;
    occupancy_percent: number;
    updated_at: string;
  }>;

  const buildingIds = occupancyRows.map((row) => row.building_id);
  const { data: buildingData, error: buildingError } = await supabase
    .from('buildings')
    .select('id, name')
    .in('id', buildingIds.length > 0 ? buildingIds : ['00000000-0000-0000-0000-000000000000']);

  if (buildingError) throw buildingError;

  const names = new Map(
    ((buildingData ?? []) as Array<{ id: string; name: string }>).map((row) => [row.id, row.name])
  );

  return occupancyRows.map((row) => ({
    building_id: row.building_id,
    occupancy_percent: row.occupancy_percent,
    updated_at: row.updated_at,
    building_name: names.get(row.building_id) ?? 'Unknown Building'
  }));
}

export async function upsertAdminOccupancy(buildingId: string, occupancyPercent: number): Promise<void> {
  await assertAdminRole();
  const supabase = getSupabaseClient();

  if (occupancyPercent < 0 || occupancyPercent > 100) {
    throw new Error('Occupancy percent must be between 0 and 100.');
  }

  const { error: upsertError } = await supabase.from('occupancy_live').upsert({
    building_id: buildingId,
    occupancy_percent: occupancyPercent,
    updated_at: new Date().toISOString()
  } as never);
  if (upsertError) throw upsertError;

  const { error: historyError } = await supabase.from('occupancy_history').insert({
    building_id: buildingId,
    occupancy_percent: occupancyPercent
  } as never);
  if (historyError) throw historyError;
}

export async function listAdminFeedback(): Promise<AdminFeedbackRow[]> {
  await assertAdminRole();
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('feedback')
    .select('id, category, sentiment, message, status, created_at, building_id')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as AdminFeedbackRow[];
}

export async function moderateFeedback(
  feedbackId: string,
  status: 'triaged' | 'resolved' | 'rejected',
  note: string
): Promise<void> {
  const profile = await assertAdminRole();
  const supabase = getSupabaseClient();

  const { error: feedbackError } = await supabase
    .from('feedback')
    .update({ status } as never)
    .eq('id', feedbackId);
  if (feedbackError) throw feedbackError;

  const { error: actionError } = await supabase.from('feedback_actions').insert({
    feedback_id: feedbackId,
    admin_id: profile.id,
    action: status,
    note
  } as never);
  if (actionError) throw actionError;
}
