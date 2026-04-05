import { describe, expect, it } from 'vitest';

import { validateRuntimeEnv } from '@/lib/env';

describe('validateRuntimeEnv', () => {
  it('accepts valid env values', () => {
    const result = validateRuntimeEnv({
      EXPO_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      EXPO_PUBLIC_SUPABASE_KEY: 'sb_publishable_abcdefghijklmnopqrstuvwxyz'
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid env values', () => {
    const result = validateRuntimeEnv({
      EXPO_PUBLIC_SUPABASE_URL: 'not-a-url',
      EXPO_PUBLIC_SUPABASE_KEY: 'tiny'
    });

    expect(result.success).toBe(false);
  });
});
