import { MOCK_PROFILE } from '@/lib/constants/mockData';
import { getSupabaseClient } from '@/services/supabase/client';
import type { Profile } from '@/types/domain';

type ProfilePrefs = Profile['accessibility_prefs'];

export async function getProfile(): Promise<Profile> {
  try {
    const supabase = getSupabaseClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return MOCK_PROFILE;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, role, accessibility_prefs')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    const row = data as unknown as {
      id: string;
      full_name: string | null;
      avatar_url: string | null;
      role: Profile['role'];
      accessibility_prefs: unknown;
    };

    return {
      id: row.id,
      full_name: row.full_name ?? 'Campus User',
      avatar_url: row.avatar_url,
      role: row.role,
      accessibility_prefs: (row.accessibility_prefs as ProfilePrefs) ?? {}
    };
  } catch {
    return MOCK_PROFILE;
  }
}

export async function updateProfilePrefs(nextPrefs: ProfilePrefs): Promise<ProfilePrefs> {
  const supabase = getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return nextPrefs;
  }

  const profile = await getProfile();
  const mergedPrefs = {
    ...profile.accessibility_prefs,
    ...nextPrefs
  };

  const { error } = await supabase
    .from('profiles')
    .update({ accessibility_prefs: mergedPrefs } as never)
    .eq('id', user.id);

  if (error) {
    throw error;
  }

  return mergedPrefs;
}
