// @reviewed 2026-04-17
/**
 * @fileoverview Public API for @saasflare/ui core utilities.
 * @module @saasflare/ui/lib
 *
 * @example
 * import { cn, createSafeContext, useControllableState } from '@saasflare/ui';
 */

// ─── Utils ───────────────────────────────────────────────────────────────────
export { cn, mergeRefs, composeEventHandlers, createSafeContext } from './utils';

// ─── Hooks ───────────────────────────────────────────────────────────────────
export { useControllableState, useCallbackRef } from './hooks';

// ─── Color ───────────────────────────────────────────────────────────────────
export { hexToOklch, isHex, type OklchTriplet } from './color';

// ─── Re-exports (keep cva at the boundary so components don't import it directly) ─
export { cva, type VariantProps } from 'class-variance-authority';