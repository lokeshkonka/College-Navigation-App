export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    console.info(`[INFO] ${message}`, meta ?? {});
  },
  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(`[WARN] ${message}`, meta ?? {});
  },
  error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    console.error(`[ERROR] ${message}`, { error, ...meta });
  }
};
