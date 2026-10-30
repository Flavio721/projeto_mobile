type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  tags: string[];
};

type PendingEntry<T> = {
  promise: Promise<T>;
  tags: string[];
};

const MAX_ENTRIES = 2000;
const entries = new Map<string, CacheEntry<unknown>>();
const pending = new Map<string, PendingEntry<unknown>>();
const tagVersions = new Map<string, number>();
const activeLoadsByTag = new Map<string, number>();

function pruneExpired(now: number) {
  for (const [key, entry] of entries) {
    if (entry.expiresAt <= now) entries.delete(key);
  }
}

/** Small per-process TTL cache with request coalescing and tag-based invalidation. */
export const cache = {
  async getOrLoad<T>(key: string, ttlMs: number, loader: () => Promise<T>, tags: string[] = []): Promise<T> {
    const now = Date.now();
    const existing = entries.get(key) as CacheEntry<T> | undefined;
    if (existing && existing.expiresAt > now) return existing.value;
    if (existing) entries.delete(key);

    const inFlight = pending.get(key) as PendingEntry<T> | undefined;
    if (inFlight) return inFlight.promise;

    const versions = tags.map((tag) => tagVersions.get(tag) ?? 0);
    for (const tag of tags) activeLoadsByTag.set(tag, (activeLoadsByTag.get(tag) ?? 0) + 1);
    const request = Promise.resolve().then(loader).then((value) => {
      const stillCurrent = tags.every((tag, index) => (tagVersions.get(tag) ?? 0) === versions[index]);
      if (stillCurrent && ttlMs > 0) {
        pruneExpired(Date.now());
        while (entries.size >= MAX_ENTRIES) entries.delete(entries.keys().next().value!);
        entries.set(key, { value, expiresAt: Date.now() + ttlMs, tags });
      }
      return value;
    }).finally(() => {
      if (pending.get(key)?.promise === request) pending.delete(key);
      for (const tag of tags) {
        const remaining = (activeLoadsByTag.get(tag) ?? 1) - 1;
        if (remaining > 0) activeLoadsByTag.set(tag, remaining);
        else {
          activeLoadsByTag.delete(tag);
          tagVersions.delete(tag);
        }
      }
    });
    pending.set(key, { promise: request, tags });
    return request;
  },

  invalidateTag(tag: string) {
    if (activeLoadsByTag.has(tag)) tagVersions.set(tag, (tagVersions.get(tag) ?? 0) + 1);
    else tagVersions.delete(tag);
    for (const [key, entry] of entries) {
      if (entry.tags.includes(tag)) entries.delete(key);
    }
    for (const [key, request] of pending) {
      if (request.tags.includes(tag)) pending.delete(key);
    }
  },
};
