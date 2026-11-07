import type { CacheEntry } from "./serviceCache.types";

class ServiceCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private versions = new Map<string, number>();

  private pending = new Map<
    string,
    {
      version: number;
      promise: Promise<unknown>;
    }
  >();

  async getOrLoad<T>(
    key: string,
    loader: () => Promise<T>,
    ttlMs = 60_000
  ): Promise<T> {
    const cached = this.get<T>(key);

    if (cached !== undefined) {
      return cached;
    }

    const version = this.getVersion(key);
    const existing = this.pending.get(key);

    if (existing?.version === version) {
      return existing.promise as Promise<T>;
    }

    const promise = loader()
      .then((data) => {
        if (this.getVersion(key) === version) {
          this.set(key, data, ttlMs);
        }

        return data;
      })
      .finally(() => {
        if (this.pending.get(key)?.promise === promise) {
          this.pending.delete(key);
        }
      });

    this.pending.set(key, { version, promise });

    return promise;
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) return undefined;

    if (Date.now() >= entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs = 60_000): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlMs,
    });
  }

  getVersion(key: string): number {
    return this.versions.get(key) ?? 0;
  }

  setIfCurrent<T>(
    key: string,
    data: T,
    version: number,
    ttlMs = 60_000
  ): void {
    if (this.getVersion(key) !== version) return;

    this.set(key, data, ttlMs);
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.versions.set(key, this.getVersion(key) + 1);
  }

  invalidatePrefix(prefix: string): void {
    const keys = new Set([
      ...this.cache.keys(),
      ...this.pending.keys(),
    ]);

    for (const key of keys) {
      if (key.startsWith(prefix)) {
        this.invalidate(key);
      }
    }
  }

  clear(): void {
    const keys = new Set([
      ...this.cache.keys(),
      ...this.pending.keys(),
      ...this.versions.keys(),
    ]);

    for (const key of keys) {
      this.versions.set(key, this.getVersion(key) + 1);
    }

    this.cache.clear();
  }
}

export const serviceCache = new ServiceCache();