import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

// Simple in-memory cache
const cache: Record<string, any> = {};

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
) {
  const {
    initialData,
    onSuccess,
    onError,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (skipCache = false) => {
    // Check cache first if cacheKey is provided
    if (cacheKey && !skipCache) {
      const cachedItem = cache[cacheKey] as CachedData<T> | undefined;
      if (cachedItem) {
        const isExpired = Date.now() - cachedItem.timestamp > cacheDuration;
        if (!isExpired) {
          setData(cachedItem.data);
          onSuccess?.(cachedItem.data);
          return;
        }
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      setData(result);
      
      // Cache the result if cacheKey is provided
      if (cacheKey) {
        cache[cacheKey] = {
          data: result,
          timestamp: Date.now(),
        };
      }
      
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, cacheKey, cacheDuration, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  const clearCache = useCallback(() => {
    if (cacheKey) {
      delete cache[cacheKey];
    }
  }, [cacheKey]);

  return { data, isLoading, error, refetch, clearCache };
}

// Helper function to clear the entire cache
export function clearAllCache() {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
}

export default useFetch;
