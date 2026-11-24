'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '../config/api';

/** Keep the persistent navbar in sync with login, navigation and inbox read actions. */
const useUnreadCount = (sessionKey: string | null) => {
  const pathname = usePathname();
  const [result, setResult] = useState<{ sessionKey: string; count: number } | null>(null);

  useEffect(() => {
    if (!sessionKey) return;
    const controller = new AbortController();
    let pending = false;

    const refresh = async () => {
      if (pending || controller.signal.aborted) return;
      pending = true;
      try {
        const data = await api.get<{ unreadCount: number }>('/threads', {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) {
          setResult({ sessionKey, count: data?.unreadCount ?? 0 });
        }
      } catch {
        if (!controller.signal.aborted) setResult({ sessionKey, count: 0 });
      } finally {
        pending = false;
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, 10_000);
    window.addEventListener('focus', refresh);
    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
    };
  }, [sessionKey, pathname]);

  return sessionKey !== null && result?.sessionKey === sessionKey ? result.count : 0;
};

export default useUnreadCount;
