import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_KEY: z.string().min(20)
});

export type RuntimeEnv = z.infer<typeof envSchema>;

export function validateRuntimeEnv(rawEnv: Record<string, string | undefined>) {
  return envSchema.safeParse(rawEnv);
}

export function getRuntimeEnv(rawEnv: Record<string, string | undefined>): RuntimeEnv {
  const parsed = envSchema.safeParse(rawEnv);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid runtime environment: ${message}`);
  }
  return parsed.data;
}
