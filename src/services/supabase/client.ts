import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getRuntimeEnv } from '@/lib/env';
import type { Database } from '@/types/database';

let client: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) {
    return client;
  }

  const env = getRuntimeEnv({
    EXPO_PUBLIC_SUPABASE_URL: process.env['EXPO_PUBLIC_SUPABASE_URL'],
    EXPO_PUBLIC_SUPABASE_KEY: process.env['EXPO_PUBLIC_SUPABASE_KEY']
  });

  client = createClient<Database>(env.EXPO_PUBLIC_SUPABASE_URL, env.EXPO_PUBLIC_SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: AsyncStorage
    }
  });

  return client;
}
