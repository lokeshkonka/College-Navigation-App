import { feedbackSchema, type FeedbackFormValues } from '@/lib/zod/feedback';
import { getSupabaseClient } from '@/services/supabase/client';

export async function submitFeedback(payload: FeedbackFormValues) {
  const parsed = feedbackSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(', '));
  }

  const supabase = getSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be signed in to submit feedback.');
  }

  const { error } = await supabase.from('feedback').insert({
    user_id: user.id,
    category: parsed.data.category,
    sentiment: parsed.data.sentiment,
    message: parsed.data.message,
    building_id: parsed.data.building_id ?? null,
    route_id: parsed.data.route_id ?? null,
    status: 'open'
  } as never);

  if (error) {
    throw error;
  }
}
