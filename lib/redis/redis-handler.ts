import { redis } from ".";

/**
 * Caches data in Redis with optional TTL (time-to-live).
 *
 * @param key - Cache key.
 * @param data - Data to cache (will be stringified).
 * @param ttl - TTL in seconds (default 3600, 0 for infinite cache).
 */

export const cacheData = async <T>(
  key: string,
  data: T,
  ttl: number = 3600 // default - 1 hour, 0 - infinity cache
): Promise<void> => {
  console.log(ttl, "SET REDIS");
  // If TTL is 0, cache indefinitely; otherwise, set with TTL.
  if (ttl === 0) {
    await redis.set(key, JSON.stringify(data));
  } else {
    await redis.setex(key, ttl, JSON.stringify(data));
  }
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  const cachedData = await redis.get(key);
  if (cachedData) {
    return JSON.parse(cachedData) as T;
  }
  return null;
};
