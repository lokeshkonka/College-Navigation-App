import { describe, expect, it } from 'vitest';

import { feedbackSchema } from '@/lib/zod/feedback';

describe('feedbackSchema', () => {
  it('accepts a valid payload', () => {
    const parsed = feedbackSchema.safeParse({
      category: 'general',
      sentiment: 4,
      message: 'Signage near the library entrance can be clearer.'
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects a short message', () => {
    const parsed = feedbackSchema.safeParse({
      category: 'suggestion',
      sentiment: 3,
      message: 'Too short'
    });

    expect(parsed.success).toBe(false);
  });

  it('rejects sentiment outside range', () => {
    const parsed = feedbackSchema.safeParse({
      category: 'report_error',
      sentiment: 9,
      message: 'Broken route line on map from library to student center.'
    });

    expect(parsed.success).toBe(false);
  });
});
