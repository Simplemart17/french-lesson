import { useState, useEffect, useCallback, useRef } from 'react';
import { memoryCache, localStorageCache, Cache } from '@/utils/cache';

// Export a sessionStorage cache instance
export const sessionStorageCache = new Cache({ storage: 'sessionStorage' });

interface UseFetchOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
  cacheStorage?: 'memory' | 'localStorage' | 'sessionStorage';
  retry?: boolean | number; // Whether to retry failed requests (true = 3 retries, number = specific retries)
  retryDelay?: number; // Delay between retries in milliseconds
  dependencies?: any[]; // Dependencies that trigger a refetch when changed
  skipInitialFetch?: boolean; // Skip the initial fetch when the component mounts
  staleWhileRevalidate?: boolean; // Return stale data while fetching fresh data
  dedupingInterval?: number; // Interval in milliseconds to dedupe requests
}

// Keep track of in-flight requests to avoid duplicate requests
const inFlightRequests: Record<string, Promise<any>> = {};

// Define the return type for better type safety
interface UseFetchReturn<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
  isValidating: boolean;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const {
    initialData,
    onSuccess,
    onError,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    cacheStorage = 'memory',
    retry = false,
    retryDelay = 1000,
    dependencies = [],
    skipInitialFetch = false,
    staleWhileRevalidate = true,
    dedupingInterval = 2000, // 2 seconds
  } = options;


  // Get the appropriate cache based on storage option
  const getCache = (): Cache => {
    switch (cacheStorage) {
      case 'localStorage':
        return localStorageCache;
      case 'sessionStorage':
        return sessionStorageCache;
      default:
        return memoryCache;
    }
  };

  // State
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!skipInitialFetch && !initialData);
  const [error, setError] = useState<Error | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Refs
  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const lastFetchTimeRef = useRef(0);

  // Function to safely update state only if component is mounted
  const safeSetState = useCallback(<S>(setter: React.Dispatch<React.SetStateAction<S>>, value: any) => {
    if (isMountedRef.current) {
      setter(value as React.SetStateAction<S>);
    }
  }, []);

  // Fetch data with retry logic
  const fetchWithRetry = useCallback(async (
    fn: () => Promise<T>,
    maxRetries: number,
    currentRetry = 0
  ): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (currentRetry < maxRetries) {
        // Calculate delay with exponential backoff
        const delay = retryDelay * Math.pow(2, currentRetry);

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));

        // Try again with incremented retry counter
        return fetchWithRetry(fn, maxRetries, currentRetry + 1);
      }
      throw err;
    }
  }, [retryDelay]);

  // Main fetch function
  const fetchData = useCallback(async (skipCache = false) => {
    // Avoid duplicate requests within deduping interval
    const now = Date.now();
    if (now - lastFetchTimeRef.current < dedupingInterval && !skipCache) {
      return;
    }
    lastFetchTimeRef.current = now;

    // Check if we have a cached version
    const cache = getCache();
    if (cacheKey && !skipCache) {
      const cachedData = cache.get<T>(cacheKey);
      if (cachedData) {
        safeSetState(setData, cachedData);
        onSuccess?.(cachedData);

        // If staleWhileRevalidate is false, we're done
        if (!staleWhileRevalidate) {
          return;
        }
      }
    }

    // If we're already loading and not explicitly skipping cache, don't start another request
    if (isLoading && !skipCache) {
      return;
    }

    // Check if there's already an in-flight request for this key
    if (cacheKey && cacheKey in inFlightRequests && !skipCache) {
      try {
        const result = await inFlightRequests[cacheKey];
        safeSetState(setData, result);
        onSuccess?.(result);
        return;
      } catch (err) {
        // If the in-flight request fails, we'll continue with a new request
      }
    }

    // Start loading
    safeSetState(setIsLoading, true);
    safeSetState(setIsValidating, true);
    safeSetState(setError, null);

    // Create the fetch promise
    const fetchPromise = async (): Promise<T> => {
      try {
        // Determine max retries
        const maxRetries = typeof retry === 'boolean' ? (retry ? 3 : 0) : retry;
        retryCountRef.current = 0;

        // Execute fetch with retry logic
        const result = await fetchWithRetry(fetchFn, maxRetries);

        // Handle undefined or null result
        if (result === undefined || result === null) {
          console.warn('useFetch received undefined/null result from fetchFn');
          // Don't update state with undefined/null
          safeSetState(setIsLoading, false);
          safeSetState(setIsValidating, false);
          return result;
        }

        // Cache the result if cacheKey is provided
        if (cacheKey) {
          cache.set(cacheKey, result, cacheDuration);
        }

        // Update state and call onSuccess
        safeSetState(setData, result);
        safeSetState(setIsLoading, false);
        safeSetState(setIsValidating, false);
        onSuccess?.(result);

        return result;
      } catch (err) {
        // Handle error
        const error = err instanceof Error ? err : new Error(String(err));
        safeSetState(setError, error);
        safeSetState(setIsLoading, false);
        safeSetState(setIsValidating, false);
        onError?.(error);
        throw error;
      } finally {
        // Clean up in-flight request
        if (cacheKey) {
          delete inFlightRequests[cacheKey];
        }
      }
    };

    // Store the promise for deduping
    if (cacheKey) {
      inFlightRequests[cacheKey] = fetchPromise();
    }

    // Execute the fetch
    await fetchPromise();
  }, [
    fetchFn,
    cacheKey,
    cacheDuration,
    cacheStorage,
    onSuccess,
    onError,
    staleWhileRevalidate,
    isLoading,
    dedupingInterval,
    safeSetState,
    fetchWithRetry,
    retry
  ]);

  // Effect to fetch data on mount and when dependencies change
  useEffect(() => {
    if (!skipInitialFetch) {
      fetchData();
    }
  }, [fetchData, skipInitialFetch, ...dependencies]);

  // Cleanup effect
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Function to manually refetch data
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  // Function to clear cache for this specific key
  const clearCache = useCallback(() => {
    if (cacheKey) {
      getCache().remove(cacheKey);
    }
  }, [cacheKey, cacheStorage]);

  return {
    data,
    isLoading,
    isValidating,
    error,
    refetch,
    clearCache
  };
}

// Helper function to clear all caches
export function clearAllCache() {
  memoryCache.clear();
  localStorageCache.clear();
  sessionStorageCache.clear();
}

export default useFetch;
