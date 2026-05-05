// @draft
/**
 * @fileoverview Dynamically set the document title with optional restore on unmount.
 * @author Saasflare™
 * @module packages/ui/hooks/use-document-title
 * @package ui
 *
 * @example
 * useDocumentTitle('Settings — MyApp');
 * useDocumentTitle(`(${unreadCount}) Inbox`, { restoreOnUnmount: true });
 */
'use client';

import { useEffect, useRef } from 'react';

/** Options for useDocumentTitle */
export interface UseDocumentTitleOptions {
  /** Restore the previous title when the component unmounts. Default: `false` */
  restoreOnUnmount?: boolean;
}

/**
 * Sets `document.title` reactively. Optionally restores the previous title on unmount.
 *
 * @param {string} title - The new document title
 * @param {UseDocumentTitleOptions} [options] - Behavior options
 *
 * @example
 * // Unread notification count in title
 * useDocumentTitle(unread > 0 ? `(${unread}) Dashboard` : 'Dashboard');
 *
 * // Restore original title when leaving page
 * useDocumentTitle('Editing Post', { restoreOnUnmount: true });
 */
export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {},
): void {
  const { restoreOnUnmount = false } = options;
  const prevTitleRef = useRef(typeof document !== 'undefined' ? document.title : '');

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    if (!restoreOnUnmount) return;
    const prev = prevTitleRef.current;
    return () => {
      document.title = prev;
    };
  }, [restoreOnUnmount]);
}
