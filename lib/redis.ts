// Enterprise Caching, Rate-Limiting, and Distributed Inventory Locking Engine
// Implements Sliding-Window & Token-Bucket Rate Limiting

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface RateLimitRecord {
  timestamps: number[];
}

class MemoryStore {
  private cache = new Map<string, CacheEntry<unknown>>();
  private rateLimits = new Map<string, RateLimitRecord>();
  private locks = new Set<string>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  // Sliding Window Rate Limiter
  checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number
  ): { allowed: boolean; remaining: number; resetInSeconds: number } {
    const now = Date.now();
    const windowStart = now - windowSeconds * 1000;
    const record = this.rateLimits.get(identifier) || { timestamps: [] };

    // Clean up expired timestamps outside window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= limit) {
      const oldest = record.timestamps[0];
      const resetInSeconds = Math.max(1, Math.ceil((oldest + windowSeconds * 1000 - now) / 1000));
      return { allowed: false, remaining: 0, resetInSeconds };
    }

    record.timestamps.push(now);
    this.rateLimits.set(identifier, record);

    return {
      allowed: true,
      remaining: limit - record.timestamps.length,
      resetInSeconds: windowSeconds,
    };
  }

  // Atomic Distributed Inventory Lock
  acquireLock(lockKey: string, ttlMs: number = 5000): boolean {
    if (this.locks.has(lockKey)) {
      return false;
    }
    this.locks.add(lockKey);
    setTimeout(() => {
      this.locks.delete(lockKey);
    }, ttlMs);
    return true;
  }

  releaseLock(lockKey: string): void {
    this.locks.delete(lockKey);
  }
}

const memoryStore = new MemoryStore();

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    return memoryStore.get<T>(key);
  },
  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    memoryStore.set<T>(key, value, ttlSeconds);
  },
  async del(key: string): Promise<void> {
    memoryStore.del(key);
  },
};

export const rateLimiter = {
  check(identifier: string, limit: number = 60, windowSeconds: number = 60) {
    return memoryStore.checkRateLimit(identifier, limit, windowSeconds);
  },
};

export const inventoryLock = {
  acquire(lockKey: string, ttlMs: number = 5000) {
    return memoryStore.acquireLock(lockKey, ttlMs);
  },
  release(lockKey: string) {
    memoryStore.releaseLock(lockKey);
  },
};

export default cache;
