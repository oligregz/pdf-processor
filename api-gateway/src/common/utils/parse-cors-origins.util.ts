export function parseCorsOrigins(value: unknown): string[] {
  if (typeof value !== 'string') {
    throw new Error('CORS_ORIGINS must be defined and be a string');
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one valid origin');
  }

  return origins;
}
