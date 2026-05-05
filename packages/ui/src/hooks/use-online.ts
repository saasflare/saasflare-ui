// @draft
/**
 * @fileoverview Track browser online/offline network status.
 * @author Saasflare™
 * @module packages/ui/hooks/use-online
 * @package ui
 *
 * @example
 * const isOnline = useOnline();
 * if (!isOnline) return <OfflineBanner />;
 */
'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the current network connectivity status.
 * Updates reactively on online/offline events.
 *
 * @returns {boolean} Whether the browser is currently online
 *
 * @example
 * const online = useOnline();
 * <Badge variant={online ? 'default' : 'destructive'}>
 *   {online ? 'Connected' : 'Offline'}
 * </Badge>
 */
export function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}
