import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

import { logger } from '@/services/logger';
import { getSupabaseClient } from '@/services/supabase/client';

export async function getSession() {
  const { data, error } = await getSupabaseClient().auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}

export async function signIn(email: string, password: string) {
  const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        full_name: fullName,
        role: 'student',
        accessibility_prefs: {}
      } as never);

    if (profileError) {
      logger.warn('Profile bootstrap after sign-up failed', { profileError });
    }
  }

  return {
    needsEmailConfirmation: !data.session
  };
}

export async function resendConfirmationEmail(email: string) {
  const { error } = await getSupabaseClient().auth.resend({
    type: 'signup',
    email
  });

  if (error) {
    throw error;
  }
}

export async function signOut() {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) {
    throw error;
  }
}

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return getSupabaseClient().auth.onAuthStateChange(callback);
}
