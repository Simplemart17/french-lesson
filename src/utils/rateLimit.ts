/**
 * Lightweight per-user rate limiter for expensive generation endpoints.
 *
 * In-memory and therefore per-server-instance: on serverless this bounds
 * burst/loop abuse within an instance rather than providing a global
 * guarantee. Good enough to stop refresh loops and scripted hammering from
 * running up OpenAI spend; move to a shared store if global limits are
 * ever needed.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= maxRequests) {
    buckets.set(key, bucket);
    return false;
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);

  // Opportunistic pruning so the map doesn't grow unbounded
  if (buckets.size > 10000) {
    for (const [k, b] of Array.from(buckets.entries())) {
      if (b.timestamps.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return true;
}
