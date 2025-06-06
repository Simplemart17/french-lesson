/**
 * Cache utility for storing and retrieving data with expiration
 */

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  expiry: number;
}

// Cache options interface
interface CacheOptions {
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
  prefix?: string;
  defaultExpiry?: number; // in milliseconds
}

/**
 * Cache class for storing and retrieving data with expiration
 */
export class Cache {
  private memoryCache: Map<string, CacheEntry<unknown>> = new Map();
  private storage: 'memory' | 'localStorage' | 'sessionStorage';
  private prefix: string;
  private defaultExpiry: number;

  /**
   * Create a new cache instance
   * @param options Cache options
   */
  constructor(options: CacheOptions = {}) {
    this.storage = options.storage || 'memory';
    this.prefix = options.prefix || 'app_cache_';
    this.defaultExpiry = options.defaultExpiry || 30 * 60 * 1000; // 30 minutes
  }

  /**
   * Set a value in the cache
   * @param key Cache key
   * @param data Data to store
   * @param expiry Expiry time in milliseconds
   */
  set<T>(key: string, data: T, expiry?: number): void {
    const expiryTime = expiry || this.defaultExpiry;
    const entry: CacheEntry<T> = {
      data,
      expiry: Date.now() + expiryTime,
    };

    if (this.storage === 'memory') {
      this.memoryCache.set(key, entry);
    } else if (typeof window !== 'undefined') {
      const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        storageObj.setItem(this.prefix + key, JSON.stringify(entry));
      } catch (error) {
        console.error('Error storing data in cache:', error);
        // Fallback to memory cache
        this.memoryCache.set(key, entry);
      }
    }
  }

  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns Cached data or null if not found or expired
   */
  get<T>(key: string): T | null {
    let entry: CacheEntry<T> | null = null;

    if (this.storage === 'memory') {
      entry = this.memoryCache.get(key) as CacheEntry<T> | undefined || null;
    } else if (typeof window !== 'undefined') {
      const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        const item = storageObj.getItem(this.prefix + key);
        if (item) {
          entry = JSON.parse(item) as CacheEntry<T>;
        }
      } catch (error) {
        console.error('Error retrieving data from cache:', error);
        // Try memory cache as fallback
        entry = this.memoryCache.get(key) as CacheEntry<T> | undefined || null;
      }
    }

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiry < Date.now()) {
      this.remove(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Remove a value from the cache
   * @param key Cache key
   */
  remove(key: string): void {
    if (this.storage === 'memory') {
      this.memoryCache.delete(key);
    } else if (typeof window !== 'undefined') {
      const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        storageObj.removeItem(this.prefix + key);
      } catch (error) {
        console.error('Error removing data from cache:', error);
      }
      // Also remove from memory cache if it exists there
      this.memoryCache.delete(key);
    }
  }

  /**
   * Clear all values from the cache
   */
  clear(): void {
    if (this.storage === 'memory') {
      this.memoryCache.clear();
    } else if (typeof window !== 'undefined') {
      const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        // Only clear items with our prefix
        const keysToRemove: string[] = [];
        for (let i = 0; i < storageObj.length; i++) {
          const key = storageObj.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => storageObj.removeItem(key));
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
      // Also clear memory cache
      this.memoryCache.clear();
    }
  }

  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get all keys in the cache
   * @returns Array of cache keys
   */
  keys(): string[] {
    if (this.storage === 'memory') {
      return Array.from(this.memoryCache.keys());
    } else if (typeof window !== 'undefined') {
      const storageObj = this.storage === 'localStorage' ? localStorage : sessionStorage;
      try {
        const keys: string[] = [];
        for (let i = 0; i < storageObj.length; i++) {
          const key = storageObj.key(i);
          if (key && key.startsWith(this.prefix)) {
            keys.push(key.substring(this.prefix.length));
          }
        }
        return keys;
      } catch (error) {
        console.error('Error getting cache keys:', error);
        return Array.from(this.memoryCache.keys());
      }
    }
    return [];
  }

  /**
   * Get the size of the cache
   * @returns Number of items in the cache
   */
  size(): number {
    return this.keys().length;
  }
}

// Create default cache instances
export const memoryCache = new Cache({ storage: 'memory' });
export const localStorageCache = new Cache({ storage: 'localStorage' });
export const sessionStorageCache = new Cache({ storage: 'sessionStorage' });

const cacheInstances = {
  memory: memoryCache,
  localStorage: localStorageCache,
  sessionStorage: sessionStorageCache,
};

export default cacheInstances;
