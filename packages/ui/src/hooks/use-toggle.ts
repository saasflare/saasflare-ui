// @draft
/**
 * @fileoverview Boolean state with toggle, setTrue, and setFalse controls.
 * @author Saasflare™
 * @module packages/ui/hooks/use-toggle
 * @package ui
 *
 * @example
 * const [isOpen, toggle, open, close] = useToggle(false);
 * <Button onClick={toggle}>Toggle</Button>
 * <Button onClick={open}>Open</Button>
 * <Button onClick={close}>Close</Button>
 */
'use client';

import { useCallback, useState } from 'react';

/**
 * Manages a boolean state with convenience controls.
 *
 * @param {boolean} [initialValue=false] - Starting value
 * @returns {[boolean, () => void, () => void, () => void]} Tuple of [value, toggle, setTrue, setFalse]
 *
 * @example
 * const [expanded, toggleExpanded, expand, collapse] = useToggle();
 */
export function useToggle(
  initialValue = false,
): [value: boolean, toggle: () => void, setTrue: () => void, setFalse: () => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}
