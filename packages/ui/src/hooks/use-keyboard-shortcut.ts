// @draft
"use client"

/**
 * @fileoverview Register keyboard shortcuts with modifier key support and cleanup.
 * @author Saasflare™
 * @module packages/ui/hooks/use-keyboard-shortcut
 * @package ui
 *
 * @example
 * // ⌘K or Ctrl+K
 * useKeyboardShortcut('k', () => setCommandOpen(true), { meta: true });
 *
 * // Escape to close
 * useKeyboardShortcut('Escape', handleClose);
 *
 * // Ctrl+Shift+S
 * useKeyboardShortcut('s', handleSave, { ctrl: true, shift: true });
 */
'use client';

import { useEffect, useRef } from 'react';

/** Modifier key requirements for the shortcut */
export interface KeyboardShortcutOptions {
  /** Require Meta (⌘ on Mac, ⊞ on Windows). Default: `false` */
  meta?: boolean;
  /** Require Ctrl. Default: `false` */
  ctrl?: boolean;
  /** Require Shift. Default: `false` */
  shift?: boolean;
  /** Require Alt. Default: `false` */
  alt?: boolean;
  /** Whether the shortcut is active. Default: `true` */
  enabled?: boolean;
  /** Prevent default browser behavior. Default: `true` */
  preventDefault?: boolean;
}

/**
 * Registers a global keyboard shortcut with optional modifier keys.
 * Automatically ignores events from input, textarea, and contenteditable elements.
 *
 * @param {string} key - The key to listen for (e.g., 'k', 'Escape', 'Enter')
 * @param {(event: KeyboardEvent) => void} callback - Handler called when shortcut fires
 * @param {KeyboardShortcutOptions} [options] - Modifier keys and behavior options
 *
 * @example
 * useKeyboardShortcut('/', () => searchRef.current?.focus(), { preventDefault: true });
 */
export function useKeyboardShortcut(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: KeyboardShortcutOptions = {},
): void {
  const {
    meta = false,
    ctrl = false,
    shift = false,
    alt = false,
    enabled = true,
    preventDefault = true,
  } = options;

  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handler = (event: KeyboardEvent) => {
      // Skip when typing in form elements
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const metaMatch = meta ? event.metaKey : !event.metaKey;
      const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;

      if (keyMatch && metaMatch && ctrlMatch && shiftMatch && altMatch) {
        if (preventDefault) event.preventDefault();
        callbackRef.current(event);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, meta, ctrl, shift, alt, enabled, preventDefault]);
}
