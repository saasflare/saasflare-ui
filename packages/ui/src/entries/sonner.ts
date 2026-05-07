/**
 * @fileoverview Subpath export for the Sonner-based Toaster. Requires `sonner` peer dep.
 *
 * `sonner` does not declare `sideEffects: false` and injects CSS at module-load
 * time, so consumer bundlers cannot eliminate the import via tree-shaking when
 * `Toaster` is unused. Keeping `Toaster` in a subpath ensures consumers who do
 * not render toasts never pull `sonner` (or its CSS) into their bundle.
 *
 * @module packages/ui/entries/sonner
 * @package ui
 *
 * @example
 * import { Toaster } from '@saasflare/ui/sonner';
 */

export { Toaster } from '../components/ui/sonner';
