export interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export interface CacheOptions<T> {
  key: string;
  get: (key: string) => T | undefined;
  set: (key: string, data: T, ttlMs?: number) => void;
  version: number;
  getVersion: (key: string) => number;
  ttlMs?: number;
}