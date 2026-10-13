import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash ? Redis.fromEnv() : null;
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number) {
  const id = `${limit}:${windowMs}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis as Redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
      prefix: "noteflow:ratelimit",
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

function memoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  if (buckets.size >= MAX_KEYS) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { success: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { success: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export async function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000
): Promise<RateLimitResult> {
  if (!redis) {
    return memoryRateLimit(key, limit, windowMs);
  }

  try {
    const { success, remaining, reset } = await getLimiter(
      limit,
      windowMs
    ).limit(key);
    return { success, remaining, resetAt: reset };
  } catch (error) {
    console.error("Rate limit backend error, falling back to memory:", error);
    return memoryRateLimit(key, limit, windowMs);
  }
}
