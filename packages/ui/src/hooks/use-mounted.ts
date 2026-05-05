// @draft
/**
 * @fileoverview Hook that returns true after component mounts (SSR/hydration safety).
 * @author Saasflare™
 * @module packages/ui/hooks/use-mounted
 * @package ui
 *
 * @example
 * const isMounted = useMounted();
 * if (!isMounted) return <Skeleton />;
 * return <ClientOnlyWidget />;
 */
'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `false` during SSR and the first render, `true` after hydration.
 * Use to guard browser-only code and prevent hydration mismatches.
 *
 * @returns {boolean} Whether the component has mounted
 *
 * @example
 * const mounted = useMounted();
 * // Only render browser-dependent UI after mount
 * return mounted ? <LocalTime /> : <span>--:--</span>;
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
