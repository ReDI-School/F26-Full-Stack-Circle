'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '../config/api';

type Result<T> = {
  url: string;
  revision: number;
  data: T | null;
  error: Error | null;
};

/** Fetch on mount, URL changes and explicit refetches. No caching or automatic retries. */
const useApi = <T>(url: string) => {
  const [request, setRequest] = useState({ url, revision: 0 });
  const [result, setResult] = useState<Result<T> | null>(null);

  // Give every URL change a fresh revision, including A -> B -> A.
  // React restarts this render before committing children or running effects.
  if (request.url !== url) {
    setRequest({ url, revision: request.revision + 1 });
  }
  const { revision } = request;

  const refetch = useCallback(() => {
    setRequest((current) => ({ ...current, revision: current.revision + 1 }));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    api.get<T>(url, { signal: controller.signal }).then(
      (data) => {
        if (!controller.signal.aborted) {
          setResult({ url, revision, data, error: null });
        }
      },
      (reason: unknown) => {
        if (!controller.signal.aborted) {
          const error = reason instanceof Error ? reason : new Error('Unable to load data.');
          setResult({ url, revision, data: null, error });
        }
      }
    );

    return () => controller.abort();
  }, [url, revision]);

  // Hide the old URL's data immediately, before the new effect starts its request.
  const loading = result === null || result.url !== url || result.revision !== revision;
  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    refetch,
  };
};

export default useApi;
