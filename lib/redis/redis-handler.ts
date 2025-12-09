import { redis } from ".";

/**
 * Caches data in Redis with optional TTL (time-to-live).
 *
 * @param key - Cache key.
 * @param data - Data to cache (will be stringified).
 * @param ttl - TTL in seconds (default 3600, 0 for infinite cache).
 */

export const cacheData = async <T>(key: string, data: T, ttl: number = 3600) => {
  const existing = await getCachedData<T>(key);
  if (existing) return;
  console.log("📝", ttl, "SET REDIS", key);
  if (ttl === 0) await redis.set(key, JSON.stringify(data));
  else await redis.setex(key, ttl, JSON.stringify(data));
};
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  const cached = await redis.get(key);
  if (typeof cached !== "string") return null;
  try {
    return JSON.parse(cached) as T;
  } catch (e) {
    console.error(`Failed to parse cache for key=${key}`, e);
    return null;
  }
};

export const deleteAllRedisKey = async (key: string) => {
  const keys = await redis.keys(`${key}_*`);
  if (keys.length > 0) await redis.del(...keys);
};
