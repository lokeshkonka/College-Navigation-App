import { z } from 'zod';

export const feedbackSchema = z.object({
  category: z.enum(['general', 'report_error', 'suggestion']),
  sentiment: z.coerce.number().int().min(1).max(5),
  message: z.string().trim().min(10, 'Message should be at least 10 characters').max(1000),
  building_id: z.string().uuid().optional(),
  route_id: z.string().uuid().optional()
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
